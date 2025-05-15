'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Social extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       Social.hasMany(models.userSocial, {
         foreignKey: 'social_id',
         as: 'usersProfile'
       });
    }
  }
  Social.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    platform: DataTypes.STRING,
    iconUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Social',
  });
  return Social;
};