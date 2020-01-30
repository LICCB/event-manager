# LICCB Event Manager Project 2019-2020
This is repository for the LICCB Event Manager.

## Software Choice
One of the main reasons for picking a NodeJS/React stack was because we all have some level of familiarity or experience with this stack.  Several of us have taken web development classes that used NodeJS.  NodeJS also has one of the biggest sets of existing code with the modules provided by npm.  The decision over Flask or Django was mostly due to preference and our group's experience with NodeJS or lack of experience with Flask or Django.

Other more high level web frameworks like Wordpress were not chosen due to their lack of flexibility.  We did not want to end up modifying existing code provided by a plugin inorder to create the user experience we are trying to acheive.  The fact that the previous groups to attempt this project used methods similar to this and did not succeed only bolstered our position.  It also seemed to us that we would get more out of the project by applying our knowledge of web development to code it ourselves as opposed to just putting plugins in Wordpress.  It is also free.

## Theory Of Operation
General idea of how various aspects of the software should work.

### Database:
All IDs will be UUIDs generated by Node (initial dummy data just uses a number).

#### Users:
* Origin of UserID
* Maintains a list of and information regarding login-access users.
* ParticipantID comes from the History table

#### History:
* Origin of ParticipantID
* Maintains a behavior history of participants to favor picking participants that will likely show up and won't cause issues
* Does not persist any personal information other than the participant's name
  * Participant's name should be used to determine if they are already in the history system
* EventCount incremented for every event the person is selected for
* Cancellations incremented everytime the event's Status for the person is 'Cancelled' or 'No Show'
* The Volunteer column will show is if the participant is registered as a Volunteer

#### Events:
* Origin of EventID
* Keeps track of all events
* Stores all global event parameters not stored in the event's table

#### Event#:
* Table created per event
* Follow the naming scheme of 'event' followed by the eventID for the event from the Events table