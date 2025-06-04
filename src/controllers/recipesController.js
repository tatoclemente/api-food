const { Recipe, Diet } = require("../db");
const { baseUrlID, baseUrl, flag } = require("../helpers/urls");
const axios = require("axios");
require("dotenv").config();
const API_KEY = process.env.API_KEY;
const { Op } = require("sequelize");

const getRecipeById = async (id, source) => {
  //* PRIMERO_____valido que el id sea de mi base de datos
  if (source === "bdd") {
    //? traigo la receta de la base de datos
    const recipeDB = await Recipe.findByPk(id, {
      include: {
        model: Diet,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });
    // extraigo las dietas de mi receta y las transformo a un array de strings

    const diets = recipeDB.Diets.map((diet) => diet.name);
    // creo un nuevo objeto con las propidades que me interesan con el array de dietas modificado
    const recipe = {
      id: recipeDB.id,
      name: recipeDB.name,
      image: recipeDB.image,
      summary: recipeDB.summary,
      healthScore: recipeDB.healthScore,
      steps: recipeDB.steps,
      diets: diets,
      created: recipeDB.created
    };

    return recipe;
  } else {
    //? SEGUNDO____ en el caso que el id sea un numero entero, traigo la receta de la api
    const { data } = await axios.get(
      `${baseUrlID}${id}/information?apiKey=${API_KEY}`
    );

    // Tengo que filtrar la informacion que me trae la API, necesito id, name, image, summary, healtScore, steps, diets

    const recipeApi = {
      id: data.id,
      name: data.title,
      image: data.image,
      summary: data.summary,
      healthScore: data.healthScore,
      steps: data.analyzedInstructions[0]?.steps.map((step) => step.step),
      diets: data.diets,
    };
    
    //* ULTIMO___ devuelvo la receta filtrada
    return recipeApi;
  }
};

const getRecipesByName = async (name) => {
  //* PRIMERO verifico si no tengo query
  if (!name) {
    // En ese caso busco todas las recetas de mi base de datos
    const allRecipesModel = await Recipe.findAll({
      include: {
      model: Diet,
      attributes: ["name"],
      through: {
        attributes: [],
      },}
      
    },);

    const allRecipesDB = allRecipesModel.map((recipe) => {
      const diets = recipe.Diets.map((diet) => diet.name);
      return {
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        steps: recipe.steps,
        diets: diets,
        created: recipe.created,
      };
    });


    // Ahora tambien busco todas las recetas (hasta 100) de la API y las unifico
    const apiKey = API_KEY;
    const pageSize = 100;
    try {
      const { data } = await axios.get(baseUrl + flag, {
        params: {
          apiKey,
          number: pageSize,
        },
      });

    const allRecipesApi = data.results.map((recipe) => {
      return {
        id: recipe.id,
        name: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        steps: recipe.analyzedInstructions ? recipe.analyzedInstructions[0]?.steps?.map((step) => step.step) : [],
        diets: recipe.diets,
      };
    });
    const allRecipes = [...allRecipesDB, ...allRecipesApi];

    return allRecipes;
      
    } catch (error) {
      console.error("Error fetching recipes from API:", error);
      return { message: "Error fetching recipes from API" };
    }

    

  } else {

    if(name.length === 0) return {message: "No recipes found"}
    const apiKey = API_KEY;
    const pageSize = 100;

    // traigo las recetas de mi Base de Datos
    const recipesModel = await Recipe.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name.toLowerCase()}%`,
        },
      },
      include: {
        model: Diet,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    const recipesDB = recipesModel.map((recipe) => {
      const diets = recipe.Diets.map((diet) => diet.name);
      return {
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        steps: recipe.steps,
        diets: diets,
        created: recipe.created,
      };
    });

    // traigo las recetas de mi API
    const { data } = await axios.get(baseUrl + flag, {
      params: {
        apiKey,
        number: pageSize,
      },
    });

    const recipesApi = data.results.map((recipe) => {
      return {
        id: recipe.id,
        name: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        steps: recipe.analyzedInstructions ? recipe.analyzedInstructions[0]?.steps.map((step) => step.step): [],
        diets: recipe.diets,
      };
    });
    const filteredRecipesApi = recipesApi.filter((recipe) => {
      return recipe.name.toLowerCase().includes(name.toLowerCase());
    });
    const allRecipesQuery = [...recipesDB, ...filteredRecipesApi];
    if (allRecipesQuery.length === 0)
      return { message: "Lo siento, no existen recetas con ese nombre" };
    return allRecipesQuery;
  }
};

const createRecipe = async (recipe) => {
  // console.log("LO QUE RECIBO AL CONTROLLER: ", recipe);

  if (
    !recipe.name ||
    !recipe.image ||
    !recipe.summary ||
    !recipe.healthScore ||
    !recipe.steps
  )
    throw Error("Faltan datos para crear la receta");

  try {
    const newRecipe = await Recipe.create({
      name: recipe.name,
      image: recipe.image,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      steps: recipe.steps,
    });
  
    // Si hay dietas, busco las dietas que tengo en mi base de datos y filtro las que coinciden con las que me llegan por body
  
    const dietDB = await Diet.findAll({
      where: { name: recipe.diets },
    });
  
    // agrego las dietas a mi receta con el metodo addDiet que me proporciona sequelize al relacionar mis modelos
    await newRecipe.addDiet(dietDB);
  
    const createdRecipe = await getRecipeById(newRecipe.id, "bdd")
  

    return createdRecipe;  
    
  } catch (error) {
    throw Error("Error uploading recipe");
  }
};

module.exports = {
  getRecipeById,
  createRecipe,
  getRecipesByName,
};
