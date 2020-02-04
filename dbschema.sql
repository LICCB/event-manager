DROP TABLE IF EXISTS LICCB.`event123e4567-e89b-12d3-a456-556642440000`;
DROP TABLE IF EXISTS LICCB.events, LICCB.history, LICCB.users;

CREATE TABLE LICCB.users(
    userID      CHAR(36) NOT NULL PRIMARY KEY,
    firstName   VARCHAR(30) NOT NULL,
    lastName    VARCHAR(30) NOT NULL,
    userEnabled BOOLEAN NOT NULL
);

CREATE TABLE LICCB.history(
    participantID   CHAR(36) NOT NULL PRIMARY KEY,
    firstName       VARCHAR(30) NOT NULL,
    lastName        VARCHAR(30) NOT NULL,
    eventCount      INT NOT NULL,
    cancellations   INT NOT NULL,
    volunteer       BOOLEAN NOT NULL,
    notes           TEXT
);

CREATE TABLE LICCB.events(
    eventID         CHAR(36) NOT NULL PRIMARY KEY,
    eventName       VARCHAR(100),
    manager         CHAR(36) NOT NULL,
    capacity        INT NOT NULL,
    maxPartySize    INT NOT NULL,
    privateEvent    BOOLEAN NOT NULL,
    startTime       DATETIME NOT NULL,
    endTime         DATETIME NOT NULL,
    skillLevel      ENUM('Beginner', 'Intermediate', 'Difficult') NOT NULL,
    distance        INT,
    staffRatio      FLOAT NOT NULL,
    creatorID       CHAR(36) NOT NULL,
    eventNotes      TEXT,
    FOREIGN KEY (manager)
        REFERENCES users(userID),
    FOREIGN KEY (creatorID)
        REFERENCES users(userID)
);

CREATE TABLE LICCB.`event123e4567-e89b-12d3-a456-556642440000`(
    participantID   CHAR(36) NOT NULL PRIMARY KEY,
    partyID         CHAR(36) DEFAULT NULL,
    isAdult         BOOLEAN NOT NULL,
    canSwim         BOOLEAN NOT NULL,
    phone           VARCHAR(30) NOT NULL,
    email           VARCHAR(75) NOT NULL,
    emergencyPhone  VARCHAR(30) NOT NULL,
    emergencyName   VARCHAR(60) NOT NULL,
    hasCPRCert      BOOLEAN NOT NULL,
    regStatus       ENUM('Registered', 'Not Selected', 'Standby', 'Selected', 'Checked In', 'No Show', 'Cancelled'),
    volunteer       BOOLEAN DEFAULT 0,
    FOREIGN KEY (participantID)
        REFERENCES history(participantID),
    FOREIGN KEY (partyID)
        REFERENCES `event123e4567-e89b-12d3-a456-556642440000`(participantID)
);