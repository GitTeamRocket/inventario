'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.user,{ foreignKey: 'user_fk', as: 'encargado'});
    }
  };
  warehouse.init({
    warehouse_name: DataTypes.STRING,
    desc: DataTypes.STRING,
    address: DataTypes.STRING,
    user_fk: DataTypes.INTEGER,
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'warehouse',
  });
  return warehouse;
};