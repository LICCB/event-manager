/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('participants', {
    participantID: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    partyID: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'participants',
        key: 'participantID'
      }
    },
    eventID: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'events',
        key: 'eventID'
      }
    },
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    emergencyPhone: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    emergencyName: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    zip: {
      type: DataTypes.CHAR(5),
      allowNull: true
    },
    isAdult: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    hasCPRCert: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    canSwim: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    boatExperience: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    boathouseDisc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    eventDisc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    regComments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    priorVolunteer: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    roleFamiliarity: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    regStatus: {
      type: DataTypes.ENUM('Awaiting Confirmation','Registered','Not Confirmed','Not Selected','Standby','Selected','Cancelled','Same Day Cancel'),
      allowNull: true
    },
    checkinStatus: {
      type: DataTypes.ENUM('Pending','Checked In','No Show'),
      allowNull: true
    },
    volunteer: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    regTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userComments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'participants'
  });
};
