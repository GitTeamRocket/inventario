'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class returning extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.borrowing,{ foreignKey: 'borrowing_fk', as: 'solicitud'});
      this.belongsTo(models.user,{ foreignKey: 'auth_user_fk', as: 'evaluador'});
    }
  };
  returning.init({
    auth_state: DataTypes.STRING,
    state: DataTypes.STRING,
    obs: DataTypes.STRING,
    borrowing_fk: DataTypes.INTEGER,
    auth_user_fk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'returning',
  });
  return returning;
};