const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'select', 'radio'], required: true },
    required: { type: Boolean, default: false },
    options: [{ type: String }],
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    fields: [fieldSchema],
  },
  { _id: false }
);

const formConfigSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    steps: [stepSchema],
  },
  { timestamps: true }
);

// Index for fast lookup by config id
formConfigSchema.index({ id: 1 });

module.exports = mongoose.model('FormConfig', formConfigSchema);
