'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.article_type,{ foreignKey: 'article_type_fk', as: 'Tipo'});
      this.belongsTo(models.warehouse,{ foreignKey: 'warehouse_fk', as: 'Bodega'});
      this.belongsTo(models.article,{ foreignKey: 'article_fk', as: 'Asociado'});  
    }
  };
  article.init({
    label: DataTypes.STRING,
    available_state: DataTypes.TEXT,
    physical_state: DataTypes.STRING,
    branch: DataTypes.STRING,
    obs: DataTypes.STRING,
    article_type_fk: DataTypes.INTEGER,
    warehouse_fk: DataTypes.INTEGER,
    article_fk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'article',
  });
  return article;
};