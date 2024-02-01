'use strict';

// imports
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class taskedTicket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.taskedTicket.belongsTo(models.user);
      models.taskedTicket.belongsTo(models.ticket);
    }

    // return tasked ticket with encrypted user id
    encrypted = (caller = false) =>
    {
      // encrypt user's id
      const encryptedId = jwt.sign({userId: this.userId}, process.env.JWT_SECRET);
      return {
        "id": this.id,
        "ticketId": this.ticketId,
        "userId": encryptedId,
        "ticket": this.ticket.encrypted(caller)
      }
    }
  };
  taskedTicket.init({
    ticketId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'taskedTicket',
  });
  return taskedTicket;
};