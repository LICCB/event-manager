CREATE TABLE LICCB.users(
    userID      BIGINT NOT NULL PRIMARY KEY,
    firstName   VARCHAR(30) NOT NULL,
    lastName    VARCHAR(30) NOT NULL,
    userEnabled BOOLEAN NOT NULL
);

CREATE TABLE LICCB.history(
    participantID   BIGINT NOT NULL PRIMARY KEY,
    firstName       VARCHAR(30) NOT NULL,
    lastName        VARCHAR(30) NOT NULL,
    eventCount      INT NOT NULL,
    cancellations   INT NOT NULL,
    volunteer       BOOLEAN NOT NULL,
    notes           TEXT
);

CREATE TABLE LICCB.events(
    eventID         BIGINT NOT NULL PRIMARY KEY,
    manager         BIGINT NOT NULL,
    capacity        INT NOT NULL,
    maxPartySize    INT NOT NULL,
    privateEvent    BOOLEAN NOT NULL,
    startTime       DATETIME NOT NULL,
    endTime         DATETIME NOT NULL,
    skillLevel      ENUM('Beginner', 'Intermediate', 'Difficult') NOT NULL,
    distance        INT,
    staffRatio      FLOAT NOT NULL,
    creatorID       BIGINT NOT NULL,
    FOREIGN KEY (manager)
        REFERENCES users(userID),
    FOREIGN KEY (creatorID)
        REFERENCES users(userID)
);

/* basic run selection process, to be elaborted */
-- CREATE TABLE selectedusers AS
-- (SELECT * FROM LICCB.users user
-- JOIN LICCB.history userhistory
-- ON userhistory.firstName = user.firstName
-- WHERE userhistory.volunteer = TRUE)

/*CREATE TABLE LICCB.event1(
    participantID   BIGINT NOT NULL PRIMARY KEY,
    partyID         BIGINT DEFAULT NULL,
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
        REFERENCES event1(participantID)
)*/
