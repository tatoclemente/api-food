const { getRecipeById, createRecipe, getRecipesByName } = require("../controllers/recipesController");

const uploadImage = require('../config/cloudinary');

const fs = require('fs');
const path = require("path");

const recipesByIdHandler = async (req, res) => {
  // Esta ruta obtiene el detalle de una receta específica. Es decir que devuelve un objeto con la información pedida en el detalle de una receta.
  // Debe incluir los datos de tipo de dieta
  // Debe funcionar tanto para los datos de la API como para los de la DB
  const { id } = req.params;
  

  // La constante source es una variable que determina si la receta se encuentra en la base de datos o si se encuentra en la API, por lo que se usa para saber que endpoint usar.
  // isNaN(id) devuelve true si el valor es NaN, false si no lo es, ya que el ID de la base de datos es un string con numeros y letras, y el ID de la API es un numero entero.
  const source = isNaN(id) ? "bdd" : "api";

  try {
    // Traigo la receta con esta funcion mágica  :-)
    // Le paso como parametros el id y la source para usar la funcion que corresponda.
    const recipe = await getRecipeById(id, source);

    res.status(200).json(recipe);

  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const recipesByNameHandler = async (req, res) => {
  // Esta ruta debe obtener todas aquellas recetas que coincidan con el nombre recibido por query. (No es necesario que sea una coincidencia exacta).
  // Debe poder buscarla independientemente de mayúsculas o minúsculas.
  // Si no existe la receta, debe mostrar un mensaje adecuado.
  // Debe buscar tanto las de la API como las de la base de datos.
  const { name } = req.query;
  try {
    // traigo las recesta que con la query con la fuuncion magica :-), le paso la query name
    const recipes = await getRecipesByName(name);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createRecipeHandler = async (req, res) => {
  // Esta ruta recibira todos los datos para crear una receta y relacionarla con los tipos de dieta que se soliciten
  //Toda la informacion debe ser recibida por el body
  // Debe crear la receta en la base de datos, y debe estar relacionada con los tipos de dieta que se solicitan(al menos uno)

  // extaigo las propiedades que necesito para crear la receta

  const { name, summary, healthScore, steps, diets } = req.body;

  try {
    const result = await uploadImage(req.files.image.tempFilePath);


    const imageUrl = result.secure_url;
    
    if(imageUrl) {
      const uploadFolderPath = path.join(__dirname, '..', '..', 'uploads')
      fs.readdir(uploadFolderPath, (err, files) => {
        if(err) {
          console.error('Error al leer los archivos: '), err;
        }else {
          files.forEach((file) => {
            const filePath = path.join(uploadFolderPath, file);
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error al eliminar el archivo: '), err;
              } else {
                console.log(`Archivo ${filePath} eliminado con éxito`)
              }
            })
          })
        }
      })
    }

    const recipe = {
      name,
      summary,
      healthScore,
      steps: JSON.parse(steps),
      image: imageUrl,
      diets: JSON.parse(diets)
    }
  
      //creo la receta con la funcion magica, le paso todas las propiedades que necesito
      const newRecipe = await createRecipe(recipe);
      res.status(201).json(newRecipe);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
}


module.exports = {
  recipesByIdHandler,
  createRecipeHandler,
  recipesByNameHandler,
};
