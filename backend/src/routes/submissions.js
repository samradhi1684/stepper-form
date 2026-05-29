const express = require('express');
const router = express.Router();
const {
  listSubmissions,
  createSubmission,
  getSubmission,
  updateSubmission,
  submitSubmission,
} = require('../controllers/submissionController');

router.get('/', listSubmissions);
router.post('/', createSubmission);
router.get('/:id', getSubmission);
router.put('/:id', updateSubmission);
router.post('/:id/submit', submitSubmission);

module.exports = router;
