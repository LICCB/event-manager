/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    userID: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    googleID: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    pictureURL: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    userEnabled: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    }
  }, {
    tableName: 'users'
  });
};
