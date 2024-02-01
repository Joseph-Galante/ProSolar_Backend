"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "admin",
          email: "admin@admin.com",
          password: "password",
          modType: "N/A",
          modNum: 0,
          modKW: 0,
          modWattage: 0,
          inverter: "N/A",
          powerwallNum: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
