'use strict';

// imports
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ticket.belongsTo(models.user);
      models.ticket.hasMany(models.taskedTicket);
    }

    // return ticket with encrypted user id
    encrypted = (caller = false) =>
    {
      // encrypt user's id
      const encryptedId = jwt.sign({userId: this.userId}, process.env.JWT_SECRET);
      if (caller)
      {
        return {
          "id": this.id,
          "title": this.title,
          "description": this.description,
          "userId": encryptedId,
          "complete": this.complete,
          "opened": this.createdAt,
          "closed": this.updatedAt,
          "caller": this.user.encrypted(false)
        }
      }
      else
      {
        return {
          "id": this.id,
          "title": this.title,
          "description": this.description,
          "userId": encryptedId,
          "complete": this.complete,
          "opened": this.createdAt,
          "closed": this.updatedAt
        }
      }
    }
  };
  ticket.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    complete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ticket',
  });
  return ticket;
};