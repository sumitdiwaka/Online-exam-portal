// src/api/examApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Your backend URL

export const fetchQuestions = async (className, subject) => {
  try {
    const response = await axios.get(`${API_URL}/questions`, {
      params: {
        class: className,
        subject: subject,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    // You might want to throw the error to be caught by the component
    throw error;
  }
};

export const submitResult = async (resultData) => {
  try {
    const response = await axios.post(`${API_URL}/results`, resultData);
    return response.data;
  } catch (error) {
    console.error('Error submitting result:', error);
    throw error;
  }
};

export const fetchResultsByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/results`, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};

export const deleteResultById = async (resultId) => {
  try {
    const response = await axios.delete(`${API_URL}/results/${resultId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting result:', error);
    throw error;
  }
};