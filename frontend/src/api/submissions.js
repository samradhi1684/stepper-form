import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Form Config ─────────────────────────────────────────────────────────────

export const fetchFormConfig = async () => {
  const { data } = await api.get('/form-config');
  return data;
};

// ─── Submissions ──────────────────────────────────────────────────────────────

export const fetchSubmissions = async () => {
  const { data } = await api.get('/submissions');
  return data;
};

export const fetchSubmission = async (id) => {
  const { data } = await api.get(`/submissions/${id}`);
  return data;
};

export const createSubmission = async (payload) => {
  const { data } = await api.post('/submissions', payload);
  return data;
};

export const updateSubmission = async ({ id, currentStep, answers }) => {
  const { data } = await api.put(`/submissions/${id}`, { currentStep, answers });
  return data;
};

export const submitSubmission = async (id) => {
  const { data } = await api.post(`/submissions/${id}/submit`);
  return data;
};
