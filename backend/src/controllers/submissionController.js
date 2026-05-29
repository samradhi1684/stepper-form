const Submission = require('../models/Submission');
const FormConfig = require('../models/FormConfig');
const { validateStepAnswers, validateFormConfig } = require('../middleware/validation');

/**
 * GET /api/submissions
 */
const listSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find()
      .sort({ createdAt: -1 })
      .select('title status currentStep progress formConfigId createdAt updatedAt')
      .lean();

    // Attach total steps count
    const config = await FormConfig.findOne({ id: 'wellness-intake' })
      .select('steps')
      .lean();
    const totalSteps = config ? config.steps.length : 0;

    const result = submissions.map((s) => ({
      ...s,
      totalSteps,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/submissions
 */
const createSubmission = async (req, res, next) => {
  try {
    const { title, formConfigId = 'wellness-intake' } = req.body;

    if (!title || String(title).trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const config = await FormConfig.findOne({ id: formConfigId }).lean();
    if (!config) {
      return res.status(404).json({ error: 'Form configuration not found' });
    }
    if (!validateFormConfig(config)) {
      return res.status(500).json({ error: 'Form configuration is broken or invalid' });
    }

    const submission = await Submission.create({
      title: String(title).trim(),
      formConfigId,
      status: 'draft',
      currentStep: 0,
      progress: 0,
      answers: {},
    });

    res.status(201).json(submission);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/submissions/:id
 */
const getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).lean();
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const config = await FormConfig.findOne({ id: submission.formConfigId }).lean();
    const totalSteps = config ? config.steps.length : 0;

    res.json({ ...submission, totalSteps });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid submission ID' });
    }
    next(err);
  }
};

/**
 * PUT /api/submissions/:id
 * Saves draft progress for a given step.
 */
const updateSubmission = async (req, res, next) => {
  try {
    const { currentStep, answers } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    if (submission.status === 'completed') {
      return res.status(400).json({ error: 'Cannot edit a completed submission' });
    }

    const config = await FormConfig.findOne({ id: submission.formConfigId }).lean();
    if (!config || !validateFormConfig(config)) {
      return res.status(500).json({ error: 'Form configuration is broken or invalid' });
    }

    const stepIndex = Number(currentStep);
    if (isNaN(stepIndex) || stepIndex < 0 || stepIndex >= config.steps.length) {
      return res.status(400).json({ error: 'Invalid step index' });
    }

    // Merge new answers into existing answers
    const mergedAnswers = Object.fromEntries(submission.answers || new Map());
    if (answers && typeof answers === 'object') {
      Object.assign(mergedAnswers, answers);
    }

    // Recalculate progress: count how many steps have all required fields filled
    let completedSteps = 0;
    for (const step of config.steps) {
      const { valid } = validateStepAnswers(step, mergedAnswers);
      if (valid) completedSteps++;
    }

    submission.currentStep = stepIndex;
    submission.answers = mergedAnswers;
    submission.progress = completedSteps;

    await submission.save();
    res.json({ ...submission.toObject(), totalSteps: config.steps.length });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid submission ID' });
    }
    next(err);
  }
};

/**
 * POST /api/submissions/:id/submit
 * Final submission — validates ALL steps.
 */
const submitSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    if (submission.status === 'completed') {
      return res.status(400).json({ error: 'Submission is already completed' });
    }

    const config = await FormConfig.findOne({ id: submission.formConfigId }).lean();
    if (!config || !validateFormConfig(config)) {
      return res.status(500).json({ error: 'Form configuration is broken or invalid' });
    }

    const answers = Object.fromEntries(submission.answers || new Map());
    const allErrors = {};

    for (let i = 0; i < config.steps.length; i++) {
      const { valid, errors } = validateStepAnswers(config.steps[i], answers);
      if (!valid) {
        allErrors[`step_${i}`] = errors;
      }
    }

    if (Object.keys(allErrors).length > 0) {
      return res.status(422).json({
        error: 'Validation failed. Please complete all required fields.',
        fieldErrors: allErrors,
      });
    }

    submission.status = 'completed';
    submission.progress = config.steps.length;
    submission.currentStep = config.steps.length - 1;
    await submission.save();

    res.json({ ...submission.toObject(), totalSteps: config.steps.length });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid submission ID' });
    }
    next(err);
  }
};

module.exports = {
  listSubmissions,
  createSubmission,
  getSubmission,
  updateSubmission,
  submitSubmission,
};
