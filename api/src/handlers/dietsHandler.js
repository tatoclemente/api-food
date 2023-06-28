const { getDiets } = require('../controllers/dietsController')

// Debe obtener un arreglo con todos los tipos de dieta
const getDietsHandler = async (req, res) => {
   try {
        const diets = await getDiets()
        res.status(200).json(diets)
    
    } catch (error) {
        res.status(500).json({ error:error.message })
    }
}

module.exports = {
    getDietsHandler,
}