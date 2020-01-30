CREATE TABLE users(
    userID      BIGINT NOT NULL PRIMARY KEY,
    firstName   VARCHAR(30) NOT NULL,
    lastName    VARCHAR(30) NOT NULL,
    userRole    BOOLEAN NOT NULL
);

CREATE TABLE history(
    participantID   BIGINT NOT NULL PRIMARY KEY,
    firstName       VARCHAR(30) NOT NULL,
    lastName        VARCHAR(30) NOT NULL,
    eventCount      INT NOT NULL,
    cancellations   INT NOT NULL,
    volunteer       BOOLEAN NOT NULL,
    notes           TEXT
);

CREATE TABLE events(
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