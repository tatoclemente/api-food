const { Router } = require("express");

const {recipesByIdHandler, createRecipeHandler, recipesByNameHandler} = require('../handlers/recipesHandler')


const recipesRouter = Router();

recipesRouter.get("/recipes/:id", recipesByIdHandler);

recipesRouter.get("/recipes", recipesByNameHandler);

recipesRouter.post("/recipes", createRecipeHandler);

module.exports = {
  recipesRouter,
};
