/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('eventTypes', {
    typeID: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    typeMetadata: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    typeName: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'eventTypes'
  });
};
