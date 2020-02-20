DROP TABLE IF EXISTS LICCB.participants, LICCB.events, LICCB.users;

CREATE TABLE LICCB.users(
    userID      CHAR(36) NOT NULL PRIMARY KEY,
    firstName   VARCHAR(30) NOT NULL,
    lastName    VARCHAR(30) NOT NULL,
    userEnabled BOOLEAN NOT NULL
);

CREATE TABLE LICCB.events(
    -- IDs
    eventID         CHAR(36) NOT NULL PRIMARY KEY,
    managerID       CHAR(36) NOT NULL,              -- 'userID' of the user assigned to the event
    creatorID       CHAR(36) NOT NULL,              -- 'userID' of the user who created the event

    -- Event Details
    eventName       VARCHAR(100) NOT NULL,
    maxPartySize    INT NOT NULL,
    privateEvent    BOOLEAN NOT NULL,
    startTime       DATETIME NOT NULL,
    endTime         DATETIME NOT NULL,
    eventStatus     ENUM('Unpublished', 'Registration Open', 'Registration Closed', 'Cancelled', 'Selection Finished', 'Archived'),
    capacity        INT,
    staffRatio      FLOAT,
    eventDesc       TEXT,
    eventNotes      TEXT,
    eventMetadata   TEXT,

    -- Foreign key for manager to ensure it is a real user
    FOREIGN KEY (managerID)
        REFERENCES users(userID),

    -- Foreign key for the creator to ensure it is a real user
    FOREIGN KEY (creatorID)
        REFERENCES users(userID)
);

CREATE TABLE LICCB.participants(
    -- IDs
    participantID   CHAR(36) NOT NULL,
    partyID         CHAR(36) DEFAULT NULL,  -- 'participantID' of the party leader
    eventID         CHAR(36) NOT NULL,      -- Event the participant is registered for

    -- Contact Info and Details
    firstName       VARCHAR(30) NOT NULL,
    lastName        VARCHAR(30) NOT NULL,
    phone           VARCHAR(30),
    email           VARCHAR(75),
    emergencyPhone  VARCHAR(30) NOT NULL,
    emergencyName   VARCHAR(60) NOT NULL,
    zip             CHAR(5),

    -- User Submitted Selection Information
    isAdult         BOOLEAN NOT NULL,
    hasCPRCert      BOOLEAN NOT NULL,
    canSwim         BOOLEAN NOT NULL,
    boatExperience  BOOLEAN NOT NULL,
    boathouseDisc   VARCHAR(100),
    eventDisc       VARCHAR(100),
    regComments     TEXT,

    -- Backend (Not filled by participant)
    regStatus       ENUM('Awaiting Confirmation', 'Registered', 'Not Confirmed', 'Not Selected', 'Standby', 'Selected', 'Cancelled', 'Same Day Cancel'),
    checkinStatus   ENUM('Pending', 'Checked In', 'No Show'),
    volunteer       BOOLEAN DEFAULT 0,
    regTime         DATETIME NOT NULL,
    userComments    TEXT,

    -- Storage Dynamic Fields
    metadata        TEXT,

    -- Primary Key (Based on participantID and eventID due to repetition of participantIDs)
    PRIMARY KEY (participantID, eventID),

    -- Foreign key to ensure the partyID is valid participantID
    FOREIGN KEY (partyID)
        REFERENCES participants(participantID),

    -- Foreign key to ensure the eventID is valid eventID
    FOREIGN KEY (eventID)
        REFERENCES events(eventID)
);