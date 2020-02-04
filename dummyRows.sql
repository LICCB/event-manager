INSERT INTO LICCB.users (userID, firstName, lastName, userEnabled)
    VALUES('1b671a64-40d5-491e-99b0-da01ff1f3341', 'Corey', 'Barnwell', 1);

INSERT INTO LICCB.history (participantID, firstName, lastName, eventCount, cancellations, volunteer, notes)
    VALUES('2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d', 'Jordan', 'Handwerger', 3, 0, 0, 'Great guy, highly recommend');

INSERT INTO LICCB.events (eventID, eventName, manager, capacity, maxPartySize, privateEvent, startTime, endTime, skillLevel, distance, staffRatio, creatorID, eventNotes)
    VALUES('123e4567-e89b-12d3-a456-556642440000', 'Test Event', '1b671a64-40d5-491e-99b0-da01ff1f3341', 15, 2, 0, '2020-7-4 12:00:00', '2020-7-4 18:00:00', 'Beginner', 2, 0.2, '1b671a64-40d5-491e-99b0-da01ff1f3341', NULL);

INSERT INTO LICCB.`event123e4567-e89b-12d3-a456-556642440000` (participantID, partyID, isAdult, canSwim, phone, email, emergencyPhone, emergencyName, hasCPRCert, regStatus, volunteer)
    VALUES('2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d', NULL, 1, 1, '908-834-2934', 'jhandwer@stevens.edu', '911', 'Police', 0, 'Registered', 0);