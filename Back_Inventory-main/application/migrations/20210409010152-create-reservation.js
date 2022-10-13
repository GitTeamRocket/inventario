'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      borrowing_fk: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { // User belongsTo Company 1:1
          model: 'borrowings',
          key: 'id'
        }
      },
      article_fk:{
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { // User belongsTo Company 1:1
          model: 'articles',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reservations');
  }
};
