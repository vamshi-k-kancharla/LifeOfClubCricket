
/*************************************************************************
 * 
 * 
 * =================
 * To Do List:
 * =================
 * 
 * Decrypt the Client Requests after moving to HTTPS mode
 * Check for Uniqueness of UserName before Registration
 * 
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * Globals : Module Imports & Http Global Variables
 * 
 *************************************************************************/

// Generic Variables Global

var http = require('http');
var url = require('url');
var fileSystem = require('fs');

var globalsForServiceModule = require('./GlobalsForService');
var HelperUtilsModule = require('./HelperUtils');

var UserAuthenticationModule = require('./UserAuthentication');
var UserRecordsQueryAndUpdatesModule = require('./UserRecordsQueryAndUpdates');

var DualChallengerRecordsUpdateModule = require('./DualChallengerRecordUpdateUtils');
var DualChallengerRecordsQueryModule = require('./DualChallengerRecordQueryUtils');

var TeamRecordsUpdateModule = require('./TeamRecordUpdateUtils');
var TeamRecordsQueryModule = require('./TeamRecordQueryUtils');

var GenericRecordsUpdateModule = require('./GenericRecordUpdateUtils');
var GenericRecordsQueryModule = require('./GenericRecordQueryUtils');



/**************************************************************************
 **************************************************************************
 * 
 *  Main Service Module : LifeOfClubCricket Web Service
 *  
 *  Start LifeOfClubCricket Web Server and serve requests from web client
 *
 **************************************************************************
 **************************************************************************
 */

/**
 * 
 * @param {XMLHttpRequest} http_request  : HTTP Request from Web Client
 * 
 * @returns {HTTpResponse} http_response  : http_response to be returned to Client with respective http_status
 * 
*/

http.createServer(function (http_request, http_response) {

    console.log("http_request.url : " + http_request.url);

    // Return unexpected urls

    if (http_request.url == null || http_request.url == "/favicon.ico") {

        console.log("unexpected http_request.url : " + http_request.url);
        return;
    }

    console.log("Content-Length : " + http_request.headers["content-length"]);
    console.log("Content-Disposition : " + http_request.headers["content-disposition"]);
    console.log("Content-Type : " + http_request.headers["content-type"]);
    console.log("referer : " + http_request.headers.referer);

    http_response.setHeader("Access-Control-Allow-Origin", "*");
    http_response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Parse the params from Web requests

    console.log("http_request.url : " + http_request.url);
    console.log("http_request.url.query : " + (url.parse(http_request.url)).query);

    var requestParams = (url.parse(http_request.url)).query;

    if (requestParams == null || requestParams == "") {

        console.log("Null /Empty http_request.url.query :");
        return;
    }

    // Extract Query Parameters

    var requestParamsCollection = requestParams.split("&");

    // Handle special characters (&) of file data ( File Upload Requests )

    requestParamsCollection = HelperUtilsModule.handleSpecialCharacters_FileUploadRequests(requestParamsCollection);

    console.log("requestParamsMap after parsing URL : ");
    console.log(requestParamsCollection);

    var clientRequestWithParamsMap = HelperUtilsModule.parseWebClientRequest(requestParamsCollection);
    console.log("Parsed the Web Client Request : " + clientRequestWithParamsMap.get("Client_Request"));

    var webClientRequest = clientRequestWithParamsMap.get("Client_Request");

    // Connect to "LifeOfClubCricket" db for "User Registration & Authentication"

    if (webClientRequest == "UserRegistration" || webClientRequest == "UserAuthentication" ||
        webClientRequest == "RetrieveUserDetails" || webClientRequest == "UpdateUserProfile") {

        handleUserDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response);

    } else if (webClientRequest == "AddDualChallenger" || webClientRequest == "UpdateDualChallenger" ||
            webClientRequest == "RetrieveDualChallengerDetails" || webClientRequest == "RemoveDualChallenger") {

        // Connect to "LifeOfClubCricket" db for "Dual Challenger Related CRUD operations"

        handleDualChallengerDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response);

    } else if (webClientRequest == "AddTeam" || webClientRequest == "UpdateTeam" ||
               webClientRequest == "RetrieveTeamDetails" || webClientRequest == "RemoveTeam") {

        // Connect to "LifeOfClubCricket" db for "Team Related CRUD operations"

        handleTeamDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response);

    } else if (webClientRequest == "SignupRequest" || webClientRequest == "UpdateSignupRequest" ||
               webClientRequest == "RetrieveSignupRequestDetails" || webClientRequest == "RemoveSignupRequest") {

        // Connect to "LifeOfClubCricket" db for "Signup Request Related CRUD operations"

        handleSignupRequestDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response);

    } else {

        console.error("LifeOfClubCricketWebService.createServer : Inappropriate/Unsupported WebClient Request received...exiting");

        var failureMessage = "LifeOfClubCricketWebService.createServer : Inappropriate/Unsupported WebClient Request received...exiting";
        HelperUtilsModule.logBadHttpRequestError("LifeOfClubCricketWebService", failureMessage, http_response);

    }

    //  close the db connection

    //db.close();
    //console.log("Closed the Db connection successfully");

    delete global.window;
    delete global.navigator;
    delete global.btoa;

}).listen(globalsForServiceModule.port);



/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleUserDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var LifeOfClubCricket_Database_Name;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoLifeOfClubCricketDbUrl, function (err, db) {

        console.log("Inside the connection to LifeOfClubCricket Mongo DB");

        if (err != null) {

            console.error("LifeOfClubCricketWebService.createServer : Server Error while connecting to LifeOfClubCricket mongo db on local server :"
                + globalsForServiceModule.mongoLifeOfClubCricketDbUrl);

            var failureMessage = "LifeOfClubCricketWebService.createServer : Server Error while connecting to LifeOfClubCricket mongo db on local server :"
                + globalsForServiceModule.mongoLifeOfClubCricketDbUrl;
            HelperUtilsModule.logInternalServerError("LifeOfClubCricketWebService.createServer", failureMessage, http_response);

        } else {

            console.log("Successfully connected to LifeOfClubCricket Details MongoDb : " + globalsForServiceModule.mongoLifeOfClubCricketDbUrl);

            // Database Creation

            console.log("Creating / Retrieving User Details Database : ");
            LifeOfClubCricket_Database_Name = db.db(globalsForServiceModule.LifeOfClubCricket_Database_Name);

            // Table( Collection ) Creation

            /*
            LifeOfClubCricket_Database_Name.createCollection(globalsForServiceModule.userDetails_TableName, function (err, result) {

                if (err) {

                    console.error("LifeOfClubCricketWebService.createServer : Error while creating / retrieving Collection ( Table ) in User Details mongoDb : "
                        + globalsForServiceModule.userDetails_TableName);

                    var failureMessage = "LifeOfClubCricketWebService.createServer : Error while creating / retrieving Collection ( Table ) in User Details mongoDb : "
                        + globalsForServiceModule.userDetails_TableName;
                    HelperUtilsModule.logInternalServerError("LifeOfClubCricketWebService.createServer", failureMessage, http_response);

                    return;
                }

                console.log("Successfully created / retrieved collection (userDetailsCollection)");
                console.log("Created / retrieved Collection ( Table ) : Now taking care of User Registration and Authentication");

                // Redirect the web Requests based on Query Key => Client_Request

                */

                switch (webClientRequest) {

                    case "UserRegistration":

                        console.log("Adding User Registration Record to Database => clientRequestWithParamsMap.get(UserName) : ",
                            clientRequestWithParamsMap.get("UserName"));

                        UserRecordsQueryAndUpdatesModule.addUserRecordToDatabase(LifeOfClubCricket_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.userRegistrationData_RequiredFields,
                            http_response);

                        console.log("LifeOfClubCricketWebService.createServer : Successfully placed User Registration call");

                        break;

                    case "UserAuthentication":

                        UserAuthenticationModule.validateUserCredentials(LifeOfClubCricket_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            http_response);

                        console.log("LifeOfClubCricketWebService.createServer : Successfully placed User Authentication call");

                        break;

                    case "UpdateUserProfile":

                        console.log("Updating User Profile in User Details Database => clientRequestWithParamsMap.get(UserName) : ",
                            clientRequestWithParamsMap.get("UserName"));

                        UserRecordsQueryAndUpdatesModule.updateUserRecordInDatabase(LifeOfClubCricket_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.userRegistrationData_RequiredFields,
                            http_response);

                        console.log("LifeOfClubCricketWebService.createServer : Successfully placed UserProfile Update call");

                        break;

                    case "RetrieveUserDetails":

                        console.log("LifeOfClubCricketWebService.createServer : Inside User Registration & Auth Switch : " +
                            "RetrieveUserDetails : UserName : " + clientRequestWithParamsMap.get("UserName"));

                        // Build Query

                        var queryMap = new Map();
                        var userName = clientRequestWithParamsMap.get("UserName");

                        if (HelperUtilsModule.valueDefined(userName)) {

                            queryMap.set("UserName", userName);
                        }

                        // DB query & Reponse Building

                        UserRecordsQueryAndUpdatesModule.retrieveRecordFromUserDetailsDatabase(LifeOfClubCricket_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            queryMap,
                            UserRecordsQueryAndUpdatesModule.handleQueryResults,
                            http_response);

                        console.log("LifeOfClubCricketWebService.createServer : Switch Statement : " +
                            "Successfully placed RetrieveUserDetails call");

                        break;

                    default:

                        console.error("LifeOfClubCricketWebService.createServer : Inappropriate Web Client Request received...exiting");

                        var failureMessage = "LifeOfClubCricketWebService : Inappropriate Web Client Request received...exiting";
                        HelperUtilsModule.logBadHttpRequestError("LifeOfClubCricketWebService", failureMessage, http_response);

                        break;

                }

            //});

        }

    });

}


/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleDualChallengerDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var dbConnection_DualChallengerDetails_Database;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoLifeOfClubCricketDbUrl, function (err, db) {

        console.log("Inside the connection to DualChallengerDetails Mongo DB");

        if (err != null) {

            console.error("LifeOfClubCricketWebService.createServer : Server Error while connecting to DualChallengerDetails mongo db on local server :"
                + globalsForServiceModule.mongoLifeOfClubCricketDbUrl);

            var failureMessage = "LifeOfClubCricketWebService.createServer : Server Error while connecting to DualChallengerDetails mongo db on local server :"
                + globalsForServiceModule.mongoLifeOfClubCricketDbUrl;
            HelperUtilsModule.logInternalServerError("LifeOfClubCricketWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to DualChallengerDetails MongoDb : " + globalsForServiceModule.mongoLifeOfClubCricketDbUrl);

            // Database Creation

            console.log("Creating / Retrieving DualChallengerDetails Database : ");
            dbConnection_DualChallengerDetails_Database = db.db(globalsForServiceModule.LifeOfClubCricket_Database_Name);

            // Table( Collection ) Creation

            /*

            dbConnection_DualChallengerDetails_Database.createCollection(globalsForServiceModule.dualChallengerDetails_Table_Name, function (err, result) {

                if (err) {

                    console.error("LifeOfClubCricketWebService.createServer : Error while creating / retrieving Collection ( Table ) in DualChallenger Details mongoDb : "
                        + globalsForServiceModule.dualChallengerDetails_Table_Name);

                    var failureMessage = "LifeOfClubCricketWebService.createServer : Error while creating / retrieving Collection ( Table ) in DualChallenger Details mongoDb : "
                        + globalsForServiceModule.dualChallengerDetails_Table_Name;
                    HelperUtilsModule.logInternalServerError("LifeOfClubCricketWebService.createServer", failureMessage, http_response);

                    return;
                }

            */

                console.log("Successfully created / retrieved collection (dualChallengerDetailsCollection)");
                console.log("Created / retrieved Collection ( Table ) : Now taking care of DualChallenger CRUD operations");

                // Redirect the web Requests based on Query => Client_Request

                switch (webClientRequest) {

                    case "AddDualChallenger":

                        DualChallengerRecordsUpdateModule.addDualChallengerRecordToDatabase(dbConnection_DualChallengerDetails_Database,
                            globalsForServiceModule.dualChallenger_Details_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.dualChallenger_RecordRequiredFields,
                            http_response);

                        console.log("LifeOfClubCricketWebService.createServer : Successfully placed Add DualChallenger Record call");

                        break;

                    case "UpdateDualChallenger":

                        DualChallengerRecordsUpdateModule.updateDualChallengerRecordInDatabase(dbConnection_DualChallengerDetails_Database,
                            globalsForServiceModule.dualChallenger_Details_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.dualChallenger_RecordFields,
                            http_response);

                        console.log("LifeOfClubCricketWebService.createServer : Successfully placed Update DualChallenger Record call");

                        break;

                    case "RetrieveDualChallengerDetails":

                        console.log("LifeOfClubCricketWebService.createServer : Inside DualChallenger Details Switch : " +
                            "RetrieveDualChallengerDetails : DualChallengerName : " + clientRequestWithParamsMap.get("Name"));

                        // DB query & Reponse Building

                        DualChallengerRecordsQueryModule.retrieveRecordFromDualChallengerDetailsDatabase(dbConnection_DualChallengerDetails_Database,
                            globalsForServiceModule.dualChallenger_Details_Table_Name,
                            clientRequestWithParamsMap,
                            DualChallengerRecordsQueryModule.handleQueryResults,
                            http_response);

                        console.log("LifeOfClubCricketWebService.createServer : Switch Statement : " +
                            "Successfully placed Retrieve_DualChallenger_Records call");

                        break;

                    case "RemoveDualChallenger":

                        DualChallengerRecordsUpdateModule.removeDualChallengerRecordInDatabase(dbConnection_DualChallengerDetails_Database,
                            globalsForServiceModule.dualChallenger_Details_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.dualChallenger_RecordRequiredFields,
                            http_response);

                        console.log("LifeOfClubCricketWebService.createServer : Successfully placed Remove DualChallenger Record call");

                        break;

                    default:

                        console.error("LifeOfClubCricketWebService.createServer : Inappropriate WebClient Request received...exiting");

                        var failureMessage = "LifeOfClubCricketWebService : Inappropriate WebClient Request received...exiting";
                        HelperUtilsModule.logBadHttpRequestError("LifeOfClubCricketWebService", failureMessage, http_response);

                        break;

                }

            //});

        }

    });

}



/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleTeamDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var dbConnection_TeamDetails_Database;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoLifeOfClubCricketDbUrl, function (err, db) {

        console.log("Inside the connection to TeamDetails Mongo DB");

        if (err != null) {

            console.error("LifeOfClubCricketWebService.createServer : Server Error while connecting to TeamDetails mongo db on local server :"
                + globalsForServiceModule.mongoLifeOfClubCricketDbUrl);

            var failureMessage = "LifeOfClubCricketWebService.createServer : Server Error while connecting to TeamDetails mongo db on local server :"
                + globalsForServiceModule.mongoLifeOfClubCricketDbUrl;
            HelperUtilsModule.logInternalServerError("LifeOfClubCricketWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to TeamDetails MongoDb : " + globalsForServiceModule.mongoLifeOfClubCricketDbUrl);

            // Database Creation

            console.log("Creating / Retrieving TeamDetails Database : ");
            dbConnection_TeamDetails_Database = db.db(globalsForServiceModule.LifeOfClubCricket_Database_Name);

            console.log("Now taking care of Team CRUD operations");

            // Redirect the web Requests based on Query => Client_Request

            switch (webClientRequest) {

                case "AddTeam":

                    TeamRecordsUpdateModule.addTeamRecordToDatabase(dbConnection_TeamDetails_Database,
                        globalsForServiceModule.team_Details_Table_Name,
                        clientRequestWithParamsMap,
                        globalsForServiceModule.team_RecordRequiredFields,
                        http_response);

                    console.log("LifeOfClubCricketWebService.createServer : Successfully placed AddTeam Record call");

                    break;

                case "UpdateTeam":

                    TeamRecordsUpdateModule.updateTeamRecordInDatabase(dbConnection_TeamDetails_Database,
                        globalsForServiceModule.team_Details_Table_Name,
                        clientRequestWithParamsMap,
                        globalsForServiceModule.team_RecordFields,
                        http_response);

                    console.log("LifeOfClubCricketWebService.createServer : Successfully placed Update Team Record call");

                    break;

                case "RetrieveTeamDetails":

                    TeamRecordsQueryModule.retrieveRecordFromTeamDetailsDatabase(dbConnection_TeamDetails_Database,
                        globalsForServiceModule.team_Details_Table_Name,
                        clientRequestWithParamsMap,
                        TeamRecordsQueryModule.handleQueryResults,
                        http_response);

                    console.log("LifeOfClubCricketWebService.createServer : Switch Statement : " +
                        "Successfully placed Retrieve_Team_Records call");

                    break;

                case "RemoveTeam":

                    TeamRecordsUpdateModule.removeTeamRecordInDatabase(dbConnection_TeamDetails_Database,
                        globalsForServiceModule.team_Details_Table_Name,
                        clientRequestWithParamsMap,
                        globalsForServiceModule.team_RecordRequiredFields,
                        http_response);

                    console.log("LifeOfClubCricketWebService.createServer : Successfully placed Remove Team Record call");

                    break;

                default:

                    console.error("LifeOfClubCricketWebService.createServer : Inappropriate WebClient Request received...exiting");

                    var failureMessage = "LifeOfClubCricketWebService : Inappropriate WebClient Request received...exiting";
                    HelperUtilsModule.logBadHttpRequestError("LifeOfClubCricketWebService", failureMessage, http_response);

                    break;

            }

        }

    });

}




/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleSignupRequestDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var dbConnection_SignupRequestDetails_Database;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoLifeOfClubCricketDbUrl, function (err, db) {

        console.log("Inside the connection to SignupRequestDetails Mongo DB");

        if (err != null) {

            console.error("LifeOfClubCricketWebService.createServer : Server Error while connecting to SignupRequestDetails mongo db on local server :"
                + globalsForServiceModule.mongoLifeOfClubCricketDbUrl);

            var failureMessage = "LifeOfClubCricketWebService.createServer : Server Error while connecting to SignupRequestDetails mongo db on local server :"
                + globalsForServiceModule.mongoLifeOfClubCricketDbUrl;
            HelperUtilsModule.logInternalServerError("LifeOfClubCricketWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to SignupRequestDetails MongoDb : " + globalsForServiceModule.mongoLifeOfClubCricketDbUrl);

            // Database Creation

            console.log("Creating / Retrieving SignupRequestDetails Database : ");
            dbConnection_SignupRequestDetails_Database = db.db(globalsForServiceModule.LifeOfClubCricket_Database_Name);

            console.log("Now taking care of SignupRequest CRUD operations");

            // Redirect the web Requests based on Query => Client_Request

            switch (webClientRequest) {

                case "SignupRequest":

                    GenericRecordsUpdateModule.addGenericRecordToDatabase(dbConnection_SignupRequestDetails_Database,
                        globalsForServiceModule.signupRequest_Details_Table_Name,
                        clientRequestWithParamsMap,
                        globalsForServiceModule.signupRequest_RecordRequiredFields,
                        "SignupRequest_Id",
                        globalsForServiceModule.signupRequest_AtleastOneValueShouldBeDifferent,
                        globalsForServiceModule.signupRequest_NameFileds,
                        http_response);

                    console.log("LifeOfClubCricketWebService.createServer : Successfully placed SignupRequest Record call");

                    break;

                case "UpdateSignupRequest":
                    
                    GenericRecordsUpdateModule.updateGenericRecordInDatabase(dbConnection_SignupRequestDetails_Database,
                        globalsForServiceModule.signupRequest_Details_Table_Name,
                        clientRequestWithParamsMap,
                        globalsForServiceModule.signupRequest_RecordFields,
                        "SignupRequest_Id",
                        http_response);

                    console.log("LifeOfClubCricketWebService.createServer : Successfully placed Update SignupRequest Record call");

                    break;

                case "RetrieveSignupRequestDetails":

                    GenericRecordsQueryModule.retrieveInputGenericRecordFromDatabase(dbConnection_SignupRequestDetails_Database,
                        globalsForServiceModule.signupRequest_Details_Table_Name,
                        clientRequestWithParamsMap,
                        "SignupRequest_Id",
                        globalsForServiceModule.signupRequest_RecordFields,
                        GenericRecordsQueryModule.handleQueryResults,
                        http_response);

                    console.log("LifeOfClubCricketWebService.createServer : Switch Statement : " +
                        "Successfully placed RetrieveSignupRequestDetails call");

                    break;

                case "RemoveSignupRequest":

                    GenericRecordsUpdateModule.removeGenericRecordInDatabase(dbConnection_SignupRequestDetails_Database,
                        globalsForServiceModule.signupRequest_Details_Table_Name,
                        clientRequestWithParamsMap,
                        globalsForServiceModule.signupRequest_RecordFields,
                        "SignupRequest_Id",
                        http_response);

                    console.log("LifeOfClubCricketWebService.createServer : Successfully placed RemoveSignupRequest Record call");

                    break;

                default:

                    console.error("LifeOfClubCricketWebService.createServer : Inappropriate WebClient Request received...exiting");

                    var failureMessage = "LifeOfClubCricketWebService : Inappropriate WebClient Request received...exiting";
                    HelperUtilsModule.logBadHttpRequestError("LifeOfClubCricketWebService", failureMessage, http_response);

                    break;

            }

        }

    });

}

