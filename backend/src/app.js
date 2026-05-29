const express = require('express');
const cors = require('cors');
const formConfigRoutes = require('./routes/formConfig');
const submissionRoutes = require('./routes/submissions');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/form-config', formConfigRoutes);
app.use('/api/submissions', submissionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
