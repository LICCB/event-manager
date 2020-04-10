/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('events', {
    eventID: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    managerID: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'userID'
      }
    },
    creatorID: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'userID'
      }
    },
    eventName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    maxPartySize: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    privateEvent: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    eventStatus: {
      type: DataTypes.ENUM('Unpublished','Registration Open','Registration Closed','Cancelled','Selection Finished','Archived'),
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    staffRatio: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    eventDesc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    eventNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    eventMetadata: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    eventType: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'eventTypes',
        key: 'typeID'
      }
    }
  }, {
    tableName: 'events'
  });
};
