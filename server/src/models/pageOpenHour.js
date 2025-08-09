'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class PageOpenHour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Một PageOpenHour thuộc về một Page
      PageOpenHour.belongsTo(models.Page, {
        foreignKey: 'page_id',
        targetKey: 'documentId',
        as: 'page'
      });
    }
  }
  PageOpenHour.init({
    documentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    page_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Pages',
        key: 'documentId'
      }
    },
    open_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    close_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    day_of_week: {
      type: DataTypes.STRING(20),
      allowNull: false,
      // validate: {
      //   isIn: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Weekend', 'Weekday']]
      // }
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'open',
      validate: {
        isIn: [['open', 'closed']]
      }
    }
  }, {
    sequelize,
    modelName: 'PageOpenHour',
    tableName: 'pageopenhours',
    freezeTableName: true,
    paranoid: true, // Sử dụng soft delete với trường deletedAt
    indexes: [
      {
        unique: true,
        fields: ['page_id', 'day_of_week']
      }
    ]
  });
  return PageOpenHour;
}; 