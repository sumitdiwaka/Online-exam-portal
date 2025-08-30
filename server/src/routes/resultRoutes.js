// src/routes/resultRoutes.js

const express = require('express');
const router = express.Router();
const { submitResult, getResultsByEmail ,deleteResult} = require('../controllers/resultController');

//Route to get user results by email
router.get('/', getResultsByEmail);

// Route to submit a result
router.post('/', submitResult);

//delete the result by id
router.delete('/:id', deleteResult);


module.exports = router;