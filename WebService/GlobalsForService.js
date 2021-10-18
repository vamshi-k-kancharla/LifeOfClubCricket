
'use strict';

/*************************************************************************
 * 
 * GlobalsForService : Module that handles Globals for Flow Control
 * 
**************************************************************************/

// Globals for retrieving the Seller bank

var periodicPollingInterval_DisjointDatabase = 5000;

// Define globals as per JSPDF Inclusion Usage/Syntax

var port = process.env.PORT || 4500;

// MongoDB Connection Variables

var mongoDbConnection = require('mongodb');
var mongoClient = mongoDbConnection.MongoClient;

// Single Database for all "LifeOfClubCricket" needs

var LifeOfClubCricket_Database_Name = "lifeOfClubCricket_DB";

// All Table/Collection Names

var userDetails_TableName = "lifeOfCricket_UserDetailsCollection";
var dualChallenger_Details_Table_Name = "dualChallenger_DetailsCollection";
var team_Details_Table_Name = "team_DetailsCollection";



// Mongo DB Database connections

var mongoLifeOfClubCricketDbUrl = 'mongodb://127.0.0.1:27017/' + LifeOfClubCricket_Database_Name;
var LifeOfClubCricketDbConnection;

var userRegistrationData_RequiredFields = ["UserType", "User_Id", "Name", "Email", "Location", "Address", "UserName", "Password"];
var userRegistrationData_UniqueFields = ["User_Id", "Email", "UserName"];


var dualChallenger_RecordRequiredFields = ["DualChallenger_Id", "TeamName", "ChallengerType", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress", "ChallengerPrize", "ChallengeStatus"];
var dualChallenger_RecordData_UniqueFields = ["DualChallenger_Id"];
var dualChallenger_RecordData_NameFileds = ["TeamName", "UserName"];
var dualChallenger_RecordData_AtleastOneValueShouldBeDifferent = ["TeamName", "ChallengerType", 
"ChallengerPlace", "ChallengerDate", "ChallengerGround"];

var dualChallenger_RecordFields = ["DualChallenger_Id", "TeamName", "ChallengerType", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress", "ChallengerPrize", "ChallengeStatus", "AcceptorName"];


var team_RecordRequiredFields = ["Team_Id", "TeamName", "Team_Location", "Team_Members", "Team_Creation_Date", 
"Team_Home_Ground"];
var team_RecordData_UniqueFields = ["Team_Id"];
var team_RecordData_NameFileds = ["TeamName", "Team_Home_Ground"];
var team_RecordData_AtleastOneValueShouldBeDifferent = ["Team_Location", "Team_Home_Ground", "Team_Ground_Address", 
"Team_Coach", "Team_Manager", "Team_Sponsorer"];

var team_RecordFields = ["Team_Id", "TeamName", "Team_Location", "Team_Members", "Team_Creation_Date", 
"Team_Home_Ground", "Team_Ground_Address", "Team_Coach", "Team_Manager", "Team_Sponsorer"];


// Global variables

var bDebug = true;



/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Export the Globals
 * 
 **************************************************************************
 **************************************************************************
 */

exports.bDebug = bDebug;

exports.LifeOfClubCricketDbConnection = LifeOfClubCricketDbConnection;

exports.periodicPollingInterval_DisjointDatabase = periodicPollingInterval_DisjointDatabase;
exports.port = port;
exports.mongoDbConnection = mongoDbConnection;
exports.mongoClient = mongoClient;

exports.LifeOfClubCricket_Database_Name = LifeOfClubCricket_Database_Name;

exports.userDetails_TableName = userDetails_TableName;
exports.dualChallenger_Details_Table_Name = dualChallenger_Details_Table_Name;
exports.team_Details_Table_Name =  team_Details_Table_Name;

exports.mongoLifeOfClubCricketDbUrl = mongoLifeOfClubCricketDbUrl;

exports.userRegistrationData_RequiredFields = userRegistrationData_RequiredFields;
exports.userRegistrationData_UniqueFields = userRegistrationData_UniqueFields;


exports.dualChallenger_RecordRequiredFields = dualChallenger_RecordRequiredFields;
exports.dualChallenger_RecordData_UniqueFields = dualChallenger_RecordData_UniqueFields;
exports.dualChallenger_RecordData_NameFileds = dualChallenger_RecordData_NameFileds;
exports.dualChallenger_RecordData_AtleastOneValueShouldBeDifferent = dualChallenger_RecordData_AtleastOneValueShouldBeDifferent; 

exports.dualChallenger_RecordFields = dualChallenger_RecordFields;


exports.team_RecordRequiredFields = team_RecordRequiredFields;
exports.team_RecordData_UniqueFields = team_RecordData_UniqueFields;
exports.team_RecordData_NameFileds = team_RecordData_NameFileds;
exports.team_RecordData_AtleastOneValueShouldBeDifferent = team_RecordData_AtleastOneValueShouldBeDifferent; 

exports.team_RecordFields = team_RecordFields;



