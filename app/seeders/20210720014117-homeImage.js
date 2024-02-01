'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('homeImages', [
      {
        src: 'https://images.squarespace-cdn.com/content/v1/56c334f31d07c0be02c3dd4e/1457991128594-XL9L7DDABORZVEDDUSAK/image-asset.png?format=1000w',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // {
      //   src: 'source',
      //   userId: idnum,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('homeImages', null, {});
  }
};
