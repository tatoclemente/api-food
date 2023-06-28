const { Router } = require('express');
const { getDietsHandler } = require('../handlers/dietsHandler')

const dietsRouter = Router(); 

dietsRouter.get('/diets', getDietsHandler)

module.exports = { 
    dietsRouter,
};