const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    formConfigId: { type: String, required: true, default: 'wellness-intake' },
    title: { type: String, required: true },
    status: { type: String, enum: ['draft', 'completed'], default: 'draft' },
    currentStep: { type: Number, default: 0, min: 0 },
    // Number of steps that have been fully saved with valid required fields
    progress: { type: Number, default: 0, min: 0 },
    answers: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Optimized indexes
submissionSchema.index({ status: 1, createdAt: -1 });
submissionSchema.index({ formConfigId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
