'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('borrowings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      auth_state: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'Aprobado, Denegado, Pendiente'
      },
      pick_up_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      return_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      obs: {
        type: Sequelize.STRING
      },
       has_returning: {
        allowNull: false,
        type: Sequelize.TINYINT
      },
      user_fk: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { // User belongsTo Company 1:1
          model: 'users',
          key: 'id'
        }
      },
      auth_user_fk: {
        type: Sequelize.INTEGER,
        references: { // User belongsTo Company 1:1
          model: 'users',
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
    await queryInterface.dropTable('borrowings');
  }
};
