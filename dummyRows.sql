INSERT INTO LICCB.users (userID, firstName, lastName, userEnabled)
    VALUES('1b671a64-40d5-491e-99b0-da01ff1f3341', 'Corey', 'Barnwell', 1);

INSERT INTO LICCB.history (participantID, firstName, lastName, eventCount, cancellations, lateCancel, volunteerCount, thumbsCount, notes)
    VALUES('2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d', 'Timmy', 'Too', 3, 0, 0, 0, 2, 'Great guy, highly recommend');
INSERT INTO LICCB.history (participantID, firstName, lastName, eventCount, cancellations, lateCancel, volunteerCount, thumbsCount, notes)
    VALUES('175cc924-d6c0-40d1-a349-cee9e1baa347', 'John', 'Smith', 8, 1, 0, 0, 0, '');

INSERT INTO LICCB.events (eventID, eventName, manager, creatorID, capacity, maxPartySize, privateEvent, startTime, endTime, staffRatio, published, eventNotes, eventMetadata)
    VALUES('123e4567-e89b-12d3-a456-556642440000', 'Test Event', '1b671a64-40d5-491e-99b0-da01ff1f3341', '1b671a64-40d5-491e-99b0-da01ff1f3341', 15, 2, 0, '2020-7-4 12:00:00', '2020-7-4 18:00:00', 0.2, 0, NULL, NULL);

INSERT INTO LICCB.`event123e4567-e89b-12d3-a456-556642440000` (participantID, partyID, isAdult, phone, email, emergencyPhone, emergencyName, hasCPRCert, regTime, regStatus, checkinStatus, thumbsUpDown, volunteer, regComments)
    VALUES('2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d', NULL, 1, '908-834-2934', 'something@stevens.edu', '911', 'Police', 0, '2020-7-1 13:38:03', 'Awaiting Confirmation', 'Pending', 'Neutral', 0, '');
INSERT INTO LICCB.`event123e4567-e89b-12d3-a456-556642440000` (participantID, partyID, isAdult, phone, email, emergencyPhone, emergencyName, hasCPRCert, regTime, regStatus, checkinStatus, thumbsUpDown, volunteer, regComments)
    VALUES('175cc924-d6c0-40d1-a349-cee9e1baa347', NULL, 1, '908-424-4829', 'somewhere@stevens.edu', '911-911-9111', 'Safety', 0, '2020-6-29 15:59:23', 'Awaiting Confirmation', 'Pending', 'Neutral', 0, '');