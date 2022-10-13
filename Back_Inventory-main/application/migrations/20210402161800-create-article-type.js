'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('article_types', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      article_type_name: {
        type: Sequelize.STRING
      },
      is_parent: {
        type: Sequelize.TINYINT
      },
      desc: {
        type: Sequelize.STRING
      },
      classif: {
        type: Sequelize.STRING,
        defaultValue: 'cocina, m_programa, m_campamento'
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
    await queryInterface.dropTable('article_types');
  }
};
