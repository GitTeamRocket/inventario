'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class borrowing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user,{foreignKey: 'user_fk', as: 'Asociado'});
      this.belongsTo(models.user,{foreignKey: 'auth_user_fk', as: 'Autoriza'});
    }
  };
  borrowing.init({
    auth_state: DataTypes.STRING,
    pick_up_date: DataTypes.DATE,
    return_date: DataTypes.DATE,
    obs: DataTypes.STRING,
    has_returning: DataTypes.TINYINT,
    user_fk: DataTypes.INTEGER,
    auth_user_fk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'borrowing',
  });
  return borrowing;
};
