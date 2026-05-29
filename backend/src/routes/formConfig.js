const express = require('express');
const router = express.Router();
const { getFormConfig } = require('../controllers/formConfigController');

router.get('/', getFormConfig);

module.exports = router;
