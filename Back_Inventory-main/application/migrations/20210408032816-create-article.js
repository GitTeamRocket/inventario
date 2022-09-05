'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      label: {
        type: Sequelize.STRING
      },
      available_state: {
        type: Sequelize.TEXT,
        defaultValue: 'disponible, prestado, dado_de_baja'
      },
      physical_state: {
        type: Sequelize.STRING,
        defaultValue: 'funcional, no_funcional, incompleto'
      },
      branch: {
        type: Sequelize.STRING,
        defaultValue: 'cachorro, lobato, webelo, scout, rover, SR'
      },
      obs: {
        type: Sequelize.STRING
      },
      article_type_fk: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: 'article_types',
          key: 'id'
        }
      },
      warehouse_fk: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: 'warehouses',
          key: 'id'
        }
      },
      article_fk: {
        type: Sequelize.INTEGER,
        references:{
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
    await queryInterface.dropTable('articles');
  }
};