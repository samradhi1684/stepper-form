const FormConfig = require('../models/FormConfig');

/**
 * GET /api/form-config
 * Returns the active form configuration.
 */
const getFormConfig = async (req, res, next) => {
  try {
    const config = await FormConfig.findOne({ id: 'wellness-intake' }).lean();
    if (!config) {
      return res.status(404).json({ error: 'Form configuration not found' });
    }
    res.json(config);
  } catch (err) {
    next(err);
  }
};

module.exports = { getFormConfig };
