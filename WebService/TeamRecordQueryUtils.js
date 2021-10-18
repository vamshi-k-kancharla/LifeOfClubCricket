
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Module to retrieve team records based on input queries
 * 
 **************************************************************************
 **************************************************************************
 */


var HelperUtilsModule = require('./HelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var RecordHelperUtilsModule = require('./RecordHelperUtils');


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Team Records : CRUD operations Wrappers Module for Queries
 *                  DB Specific User Input/Output processing
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {Object} queryResult  : Result object of the Web Cient query
 * @param {XMLHttpRequest} http_request  : http request passed from web service handler
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.handleQueryResults = function (queryResult, http_response) {

    console.log("Callback Function (handleQueryResults) : Successfully retrieved the records through function " +
        "(mongoDbCrudModule.retrieveRecordsFromDatabase) => ");
    console.log(queryResult);

    var queryResponse_JSON_String = buildQueryResponse_JSON(queryResult);

    // Build Success Response with Query Results

    http_response.writeHead(200, { 'Content-Type': 'application/json' });
    http_response.end(queryResponse_JSON_String);

    console.log("TeamRecordQueryUtils.handleQueryResults: Written Success response for input query : Response => " +
        queryResponse_JSON_String);
}


/**
 * 
 * @param {Object} queryResult  : query Response received from Mongo DB
 * 
 * @returns {String} queryResponse_TeamRecord_JSON_String  : JSON String of Retrieved Team Record(s)
 *
 */

function buildQueryResponse_JSON(queryResult) {

    var queryResponse_TeamRecord_JSON_String = "";

    for (var i = 0; i < queryResult.length; i++) {

        var currentRecord = queryResult[i];

        if (HelperUtilsModule.valueDefined(currentRecord.Team_Id) ) {

            queryResponse_TeamRecord_JSON_String += JSON.stringify(RecordHelperUtilsModule.buildJSONRecord(currentRecord,
                GlobalsForServiceModule.team_RecordFields));

            if (i != queryResult.length - 1) {

                queryResponse_TeamRecord_JSON_String += "\n";
            }
        }

    }

    return queryResponse_TeamRecord_JSON_String;
}


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Team Details Record Query Processing & Response Building
 * 
 **************************************************************************
 **************************************************************************
 */

/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database 
 * @param {String} collectionName  : Name of Table ( Collection )
 * 
 * @param {Map} clientRequestWithParamsMap : Map of <K,V> Pairs ( Record ) used to generate LC
 * @param {Function} handleQueryResults  : Call back function to handle the Query Results
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.retrieveRecordFromTeamDetailsDatabase = function (dbConnection, collectionName, clientRequestWithParamsMap,
    handleQueryResults, http_response) {

    // Team Record Retrieval based on "Team_Id || Name || Team_Type || Place || StartDate || EndDate || Amount || UserName"

    var queryObject = new Object();

    var teamRecordDetails = GlobalsForServiceModule.team_RecordFields;
    var parameterList = " ";

    // Fill the record document object values

    for (var currentDetailOfRecord of teamRecordDetails) {

        if( HelperUtilsModule.valueDefined(clientRequestWithParamsMap.get(currentDetailOfRecord)) ) {

            parameterList += currentDetailOfRecord;
            parameterList += " : ";
            parameterList += clientRequestWithParamsMap.get(currentDetailOfRecord);
            parameterList += ", ";

            queryObject[currentDetailOfRecord] = clientRequestWithParamsMap.get(currentDetailOfRecord);
        }
    }

    console.log("TeamRecordQueryUtils.retrieveRecordFromTeamDetailsDatabase => collectionName :" + collectionName);
    console.log("TeamRecordQueryUtils.retrieveRecordFromTeamDetailsDatabase : Called with Parameter List : " + parameterList);

    // Remove URL representation of spaces

    queryObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryObject);

    // Query for Team Records

    if (Object.keys(queryObject).length > 0) {

        dbConnection.collection(collectionName).find(queryObject).toArray(function (err, result) {

            if (err) {

                var failureMessage = "TeamRecordQueryUtils.retrieveRecordFromTeamDetailsDatabase : Internal Server Error while querying for specific Records from TeamDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromTeamDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("TeamRecordQueryUtils.retrieveRecordFromTeamDetailsDatabase : Successfully retrieved queried records => ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "TeamRecordQueryUtils.retrieveRecordFromTeamDetailsDatabase : Null Records returned for TeamDetails Record query";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromTeamDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);
        });

    } else {

        dbConnection.collection(collectionName).find({}).toArray(function (err, result) {

            if (err) {

                var failureMessage = "TeamRecordQueryUtils.retrieveRecordFromTeamDetailsDatabase : Internal Server Error while querying for all the Records from TeamDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromTeamDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("TeamRecordQueryUtils.retrieveRecordFromTeamDetailsDatabase : Successfully retrieved all the records => ");
            console.log(result);

            if ( !HelperUtilsModule.valueDefined(result) ) {

                var failureMessage = "TeamRecordQueryUtils.retrieveRecordFromTeamDetailsDatabase : Null Records returned for TeamDetails Record query For All Records";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromTeamDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);

        });

    }

}

