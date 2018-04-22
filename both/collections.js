import { Mongo } from 'meteor/mongo';

/**
 * _id: the id
 * name: a name describing the team
 * owner: the id of the user, who owns (created) the team
 */
Teams = new Mongo.Collection("teams");

/**
 * _id: the id
 * name: a name for the resource
 * mattermostUrl: the url of the Mattermost weblink. When set, occupations and releases are notified to this url
 * teamId: the id of the Team
 * occupiedBy: a name of the user who occupied a resource
 * occupiedByUser: the id of the user, who occupied the resource (only set, when occupied by a registered user)
 */
Resources = new Mongo.Collection("resources");
