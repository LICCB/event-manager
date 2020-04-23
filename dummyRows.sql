INSERT INTO LICCB.roles (roleID, grantInfo)
    VALUES
    ('7d4666ef-2d92-4f8a-ae4f-6b61d568031b', '{"Admin" :{"Events": {"create:any": ["*"], "read:any": ["*"],"update:any": ["*"], "delete:any": ["*"]},"EventTypes" : {"create:any": ["*"],"read:any": ["*"],"update:any": ["*"], "delete:any": ["*"]},"Participants": {"create:any": ["*"],"read:any": ["*"],"update:any": ["*"], "delete:any": ["*"]},"Users" : {"create:any": ["*"],"read:any": ["*"],"update:any": ["*"], "delete:any": ["*"]}}}'),
    ('7d4666ef-2d92-4f8a-ae4f-6b61d568045b', '{"Read Only" :{"Events": {"read:any": ["*"]},"EventTypes" : {"read:any": ["*"]},"Participants": {"read:any": ["*"]},"Users" : {"read:any": ["*"]}}}');

INSERT INTO LICCB.users (userID, googleID, pictureURL, email, firstName, lastName, userEnabled, roleID)
    VALUES
    ('1b671a64-40d5-491e-99b0-da01ff1f3341', '1b671a64-40d5-491e-99b0-da01ff1f3341', '', 'jhandwer@stevens.edu', 'Jordan', 'Handwerger', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568045b'),
    ('f679a992-3b44-40f3-839f-2c5f43a5ac47', '1b671a64-40d5-491e-99b0-da01ff1f3341', '', 'barnwell9@gmail.com', 'Corey', 'Barnwell', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('3c17760d-9589-4db6-8110-34ec9dda457f', '1b671a64-40d5-491e-99b0-da01ff1f3341', '', 'kmorel1339@gmail.com', 'K', 'M', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('44a94c19-11df-495f-9351-b31f90459afc', '1b671a64-40d5-491e-99b0-da01ff1f3341', '', 'cjlando3297@gmail.com', 'C', 'L', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('1ed00f27-029a-4431-9e26-969c70b1d387', '1b671a64-40d5-491e-99b0-da01ff1f3341', '', 'senholmes.21@gmail.com', 'S', 'H', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('b4e4c282-2dcc-4731-8448-f1f8ec9e39bf', '1b671a64-40d5-491e-99b0-da01ff1f3341', '', 'ankdave97@gmail.com', 'A', 'D', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('858603fb-4980-430b-970c-c80159666dae', '858603fb-4980-430b-970c-c80159666dae', '', 'charlie.harper@gmail.com', 'Charlie', 'Harper', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('c7eff1d1-46da-4c5c-8c22-c808b1886db6', 'c7eff1d1-46da-4c5c-8c22-c808b1886db6', '', 'david.matten@licboathouse.com', 'David', 'Matten', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('4a8cdd30-2d9d-46df-b74a-bf477fa4092a', '4a8cdd30-2d9d-46df-b74a-bf477fa4092a', '', 'dmatten00@gmail.com', 'David', 'Matten', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('cd521b6d-2b9a-4480-a022-b5ab55aada58', 'cd521b6d-2b9a-4480-a022-b5ab55aada58', '', 'licboathouse@gmail.com,', 'LIC Boathouse', 'Admin', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('aa56ca40-a9cb-4f51-a943-c6eec9f763fe', 'aa56ca40-a9cb-4f51-a943-c6eec9f763fe', '', 'licboathouse.ms@gmail.com', 'Michael', 'Smalley', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('27d031a3-ebd5-440c-97fb-052d89c31259', '27d031a3-ebd5-440c-97fb-052d89c31259', '', 'licboathouse.am@gmail.com', 'Agnes', 'Michalek', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('ed54e319-d363-4b46-a9cc-cea878ba8ab3', 'ed54e319-d363-4b46-a9cc-cea878ba8ab3', '', 'liccboathouse@gmail.com', 'LICCB Org', 'Generic Checkin', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b'),
    ('e382d3ee-392d-42c1-a453-5c97806be39d', 'e382d3ee-392d-42c1-a453-5c97806be39d', '', 'britney.spears@gmail.com', 'Britney', 'Spears', 1, '7d4666ef-2d92-4f8a-ae4f-6b61d568031b');

INSERT INTO LICCB.eventTypes (typeID, typeMetadata, typeName)
    VALUES('6d4776ef-2d92-4f8a-ae4f-6b61d568031b', '{"extraCarSeats": "textbox"}', 'test');

INSERT INTO LICCB.events (eventID, managerID, creatorID, eventName, maxPartySize, privateEvent, startTime, endTime, eventStatus, capacity, staffRatio, eventDesc, eventNotes, eventMetadata, eventType)
    VALUES('123e4567-e89b-12d3-a456-556642440000', 'e382d3ee-392d-42c1-a453-5c97806be39d', '1b671a64-40d5-491e-99b0-da01ff1f3341', 'July Outting', 2, 0, '2020-7-10 12:00:00', '2020-7-10 18:00:00', 'Registration Open', 15, 0.5, 'Annual July boating adventure!', NULL, NULL, '6d4776ef-2d92-4f8a-ae4f-6b61d568031b');

INSERT INTO LICCB.participants (participantID, partyID, eventID, firstName, lastName, phone, email, emergencyPhone, emergencyName, emergencyRelation, zip, isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, eventDisc, regComments, priorVolunteer, roleFamiliarity, regStatus, checkinStatus, volunteer, regTime, userComments, metadata)
    VALUES ('2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d', NULL, '123e4567-e89b-12d3-a456-556642440000', 'Timmy', 'Too', 
    '732-582-4952', 'timmytoo@gmail.com', '938-482-4859', 'Rob Lowe', 'Friend', '04853', 0, 0, 1, 0, 'Friend', 'Friend', NULL, 0, 0, 'Awaiting Confirmation',
    'Pending', 0, '2020-7-4 12:27:42', NULL, NULL),
    ('f1426989-b6a0-4358-8c10-be0e5cd41645', NULL, '123e4567-e89b-12d3-a456-556642440000', 'Johnny', 'Twoshoes', 
    '838-238-5392', 'johnnyboy@yahoo.com', '829-482-5728', 'Chris Treager', 'Brother from another mother', '23842', 1, 1, 1, 1, 'Family', 'Email', NULL, 0, 0, 'Registered',
    'Pending', 0, '2020-7-7 18:47:34', NULL, NULL),
    ('98cabaaa-41b6-40ed-a203-0ad96f78c72e', '98cabaaa-41b6-40ed-a203-0ad96f78c72e', '123e4567-e89b-12d3-a456-556642440000', 'Johnny', 'Bravo', 
    '384-482-3952', 'hannabarbera@yahoo.com', '929-284-1935', 'Van Partible', 'Dad', '23905', 1, 0, 1, 1, 'Website', 'Facebook', NULL, 0, 0, 'Registered',
    'Pending', 0, '2020-7-6 7:35:12', NULL, NULL),
    ('68d97c3b-f52e-4294-bf47-c01d30e58545', '98cabaaa-41b6-40ed-a203-0ad96f78c72e', '123e4567-e89b-12d3-a456-556642440000', 'Jimmy', 'Neutron', 
    '294-583-4910', 'brainboy@hotmail.com', '485-294-2910', 'Wesley Snipes', 'Some guy', '93022', 0, 0, 1, 1, 'Website', 'Facebook', NULL, 0, 0, 'Registered',
    'Pending', 0, '2020-7-6 7:35:12', NULL, NULL),
    ('6cd3092f-72cb-4b53-b469-706e163917c9', NULL, '123e4567-e89b-12d3-a456-556642440000', 'Leslie', 'Knope', 
    '429-482-9532', 'leslieforpresident@aol.com', '930-392-4920', 'Ben Wyatt', 'Best friend and husband', '74292', 1, 1, 1, 1, 'Ad', 'Facebook', NULL, 0, 0, 'Registered',
    'Pending', 0, '2020-7-2 5:00:00', NULL, NULL);

INSERT INTO LICCB.events (eventID, managerID, creatorID, eventName, maxPartySize, privateEvent, startTime, endTime, eventStatus, capacity, staffRatio, eventDesc, eventNotes, eventMetadata, eventType)
    VALUES('db21ff8e-cf41-4261-9bbe-591eb5dbd862', '858603fb-4980-430b-970c-c80159666dae', '1b671a64-40d5-491e-99b0-da01ff1f3341', 'January Outting', 2, 0, '2020-1-11 12:00:00', '2020-1-11 18:00:00', 'Selection Finished', 20, 0.2, 'Join us for a fun trip down the Hudson!', NULL, NULL, '6d4776ef-2d92-4f8a-ae4f-6b61d568031b');

INSERT INTO LICCB.participants (participantID, partyID, eventID, firstName, lastName, phone, email, emergencyPhone, emergencyName, emergencyRelation, zip, isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, eventDisc, regComments, priorVolunteer, roleFamiliarity, regStatus, checkinStatus, volunteer, regTime, userComments, metadata)
    VALUES('33faf21b-c0c5-4586-8952-ad89f52a6708', NULL, 'db21ff8e-cf41-4261-9bbe-591eb5dbd862', 'Papa', 'John', 
    '834-582-3292', 'founder@papajohns.com', '837-283-4810', 'Ceasar', 'Some guy idk', '57293', 1, 0, 1, 0, 'Website', 'Facebook', NULL, 0, 0, 'Selected',
    'Checked In', 0, '2020-1-5 4:33:22', NULL, NULL),
    ('f1426989-b6a0-4358-8c10-be0e5cd41645', NULL, 'db21ff8e-cf41-4261-9bbe-591eb5dbd862', 'Johnny', 'Twoshoes', 
    '838-238-5392', 'johnnyman@gmail.com', '829-482-5728', 'Chris Treager', 'Brother', '23428', 1, 1, 1, 1, 'Family', 'Facebook', NULL, 0, 0, 'Standby',
    'Pending', 0, '2020-1-2 18:47:34', NULL, NULL),
    ('ac073f6b-5d9a-4fdd-aa5b-b975be284d83', 'ac073f6b-5d9a-4fdd-aa5b-b975be284d83', 'db21ff8e-cf41-4261-9bbe-591eb5dbd862', 'Chris', 'Pratt', 
    '923-349-0924', 'chris@pandr.com', '381-492-2430', 'Adam Scott', 'Boss', '23493', 1, 0, 1, 0, 'Co-worker', 'Email', NULL, 0, 0, 'Selected',
    'Checked In', 0, '2020-1-3 20:37:29', NULL, NULL),
    ('3e0b1bba-ba98-4e44-a7c0-6793a03e8821', 'ac073f6b-5d9a-4fdd-aa5b-b975be284d83', 'db21ff8e-cf41-4261-9bbe-591eb5dbd862', 'Ann', 'Perkins', 
    '923-345-2939', 'crazynurse@gmail.com', '843-239-2394', 'Andy Dwyer', 'Boyfriend', '23940', 1, 1, 1, 1, 'Website', 'Email', NULL, 0, 0, 'Selected',
    'Checked In', 0, '2020-1-3 20:37:29', NULL, NULL),
    ('3c1da2d1-113b-4c0b-9de8-08b24cca5f5d', NULL, 'db21ff8e-cf41-4261-9bbe-591eb5dbd862', 'Jerry', 'Gergich', 
    '201-129-4592', 'gary@pandr.com', '324-567-1392', 'Gayle Gergich', 'Wife', '40394', 1, 0, 1, 1, 'Website', 'Friend', NULL, 0, 0, 'Selected',
    'Checked In', 0, '2020-1-8 6:24:00', NULL, NULL);
