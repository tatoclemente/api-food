const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Recipe",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      //resumen
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      //puntos saludables
      healthScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      //paso a paso
      steps: {
        type: DataTypes.ARRAY(DataTypes.STRING(400)),
        allowNull: false, 
      },
      created: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }
    },
    { timestamps: false }
  );
};
