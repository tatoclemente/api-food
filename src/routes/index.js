const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const { recipesRouter } = require("./recipesRouter");

const { dietsRouter } = require("./dietsRouter");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//* Router Recipes
router.use('/', recipesRouter)


//* Router Diets
router.use('/', dietsRouter);

module.exports = router;
