
// Aca guardo todas las URL que voy a usar en mi proyecto

const baseUrl = 'https://api.spoonacular.com/recipes/complexSearch?'


// Aca guardo la URL de las recetas por ID,necesito pasar el id que viene por params y anexarle al final de la ruta  '/information'
const baseUrlID = 'https://api.spoonacular.com/recipes/';

// Aca pongo la bandera que me permite que me devuelva informacion adicional de la receta
const flag = 'addRecipeInformation=true';

module.exports = {
    baseUrl,
    baseUrlID,
    flag,
}
//   URL                                                  FLAG                       API_KEY
//'https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&apiKey=tuApi_Key'