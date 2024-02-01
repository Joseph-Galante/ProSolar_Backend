'use strict';

// imports
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.ticket);
      models.user.hasMany(models.taskedTicket);
      models.user.hasMany(models.homeImage);
    }

    // password check
    verifyPassword = (input) =>
    {
      return input === this.password;
    }
    // return user with encrypted id
    encrypted = (profile = true) =>
    {
      const encryptedId = jwt.sign({userId: this.id}, process.env.JWT_SECRET);

      if (profile)
      {
        return {
          "id": encryptedId,
          "name": this.name,
          "email": this.email,
          "password": this.password,
          "homeImages": this.homeImages,
          "modType": this.modType,
          "modNum": this.modNum,
          "modKW": this.modKW,
          "modWattage": this.modWattage,
          "inverter": this.inverter,
          "powerwallNum": this.powerwallNum
        }
      }
      else
      {
        return {
          "name": this.name,
          "email": this.email
        }  
      }
    }
  };
  user.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    modType: DataTypes.STRING,
    modNum: DataTypes.INTEGER,
    modKW: DataTypes.INTEGER,
    modWattage: DataTypes.INTEGER,
    inverter: DataTypes.STRING,
    powerwallNum: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  // user.addHook('beforeCreate', (user) => {
  //   const hashPassword = bcrypt.hashSync(user.password, 10);
  //   user.password = hashPassword;
  // });
  // user.addHook('beforeUpdate', (user) => {
  //   const hashPassword = bcrypt.hashSync(user.password, 10);
  //   user.password = hashPassword;
  // });
  return user;
};