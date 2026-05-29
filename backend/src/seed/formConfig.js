require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const FormConfig = require('../models/FormConfig');

const config = {
  id: 'wellness-intake',
  title: 'Wellness Intake',
  steps: [
    {
      id: 'personal-details',
      title: 'Personal Details',
      fields: [
        { name: 'fullName', label: 'Full Name', type: 'text', required: true },
        { name: 'age', label: 'Age', type: 'text', required: true },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          required: true,
          options: ['Male', 'Female', 'Other'],
        },
      ],
    },
    {
      id: 'wellness-preferences',
      title: 'Wellness Preferences',
      fields: [
        {
          name: 'primaryGoal',
          label: 'Primary Goal',
          type: 'select',
          required: true,
          options: ['Sleep Better', 'Reduce Stress', 'Improve Focus'],
        },
        {
          name: 'supportType',
          label: 'Support Type',
          type: 'radio',
          required: true,
          options: ['Self Guided', 'Coach Support', 'Not Sure'],
        },
      ],
    },
    {
      id: 'availability',
      title: 'Availability',
      fields: [
        {
          name: 'preferredTime',
          label: 'Preferred Time',
          type: 'select',
          required: true,
          options: ['Morning', 'Afternoon', 'Evening'],
        },
        {
          name: 'contactMethod',
          label: 'Contact Method',
          type: 'radio',
          required: true,
          options: ['Email', 'Phone', 'SMS'],
        },
      ],
    },
  ],
};

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stepper-form';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await FormConfig.findOneAndUpdate({ id: config.id }, config, {
      upsert: true,
      new: true,
    });

    console.log('Form config seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
