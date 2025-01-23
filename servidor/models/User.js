const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  CODIGO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  COD_FUNCIONARIO: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NOME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SENHA: {
    type: DataTypes.STRING,
    allowNull: false, 
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = User;
