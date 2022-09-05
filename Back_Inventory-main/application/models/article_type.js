'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class article_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  article_type.init({
    article_type_name: DataTypes.STRING,
    is_parent: DataTypes.TINYINT,
    desc: DataTypes.STRING,
    classif: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'article_type',
  });
  return article_type;
};