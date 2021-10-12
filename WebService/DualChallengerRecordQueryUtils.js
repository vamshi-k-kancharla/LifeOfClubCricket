
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Module to retrieve dualChallenger records based on input queries
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
 * DualChallenger Records : CRUD operations Wrappers Module for Queries
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

    console.log("DualChallengerRecordQueryUtils.handleQueryResults: Written Success response for input query : Response => " +
        queryResponse_JSON_String);
}


/**
 * 
 * @param {Object} queryResult  : query Response received from Mongo DB
 * 
 * @returns {String} queryResponse_DualChallengerRecord_JSON_String  : JSON String of Retrieved DualChallenger Record(s)
 *
 */

function buildQueryResponse_JSON(queryResult) {

    var queryResponse_DualChallengerRecord_JSON_String = "";

    for (var i = 0; i < queryResult.length; i++) {

        var currentRecord = queryResult[i];

        if (HelperUtilsModule.valueDefined(currentRecord.DualChallenger_Id) ) {

            queryResponse_DualChallengerRecord_JSON_String += JSON.stringify(RecordHelperUtilsModule.buildJSONRecord(currentRecord,
                GlobalsForServiceModule.dualChallenger_RecordRequiredFields));

            if (i != queryResult.length - 1) {

                queryResponse_DualChallengerRecord_JSON_String += "\n";
            }
        }

    }

    return queryResponse_DualChallengerRecord_JSON_String;
}


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * DualChallenger Details Record Query Processing & Response Building
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

exports.retrieveRecordFromDualChallengerDetailsDatabase = function (dbConnection, collectionName, clientRequestWithParamsMap,
    handleQueryResults, http_response) {

    // DualChallenger Record Retrieval based on "DualChallenger_Id || Name || DualChallenger_Type || Place || StartDate || EndDate || Amount || UserName"

    var queryObject = new Object();

    var dualChallengerRecordDetails = GlobalsForServiceModule.dualChallenger_RecordRequiredFields;
    var parameterList = " ";

    // Fill the record document object values

    for (var currentDetailOfRecord of dualChallengerRecordDetails) {

        if( HelperUtilsModule.valueDefined(clientRequestWithParamsMap.get(currentDetailOfRecord)) ) {

            parameterList += currentDetailOfRecord;
            parameterList += " : ";
            parameterList += clientRequestWithParamsMap.get(currentDetailOfRecord);
            parameterList += ", ";

            queryObject[currentDetailOfRecord] = clientRequestWithParamsMap.get(currentDetailOfRecord);
        }
    }

    console.log("DualChallengerRecordQueryUtils.retrieveRecordFromDualChallengerDetailsDatabase => collectionName :" + collectionName);
    console.log("DualChallengerRecordQueryUtils.retrieveRecordFromDualChallengerDetailsDatabase : Called with Parameter List : " + parameterList);

    // Remove URL representation of spaces

    queryObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryObject);

    // Query for DualChallenger Records

    if (Object.keys(queryObject).length > 0) {

        dbConnection.collection(collectionName).find(queryObject).toArray(function (err, result) {

            if (err) {

                var failureMessage = "DualChallengerRecordQueryUtils.retrieveRecordFromDualChallengerDetailsDatabase : Internal Server Error while querying for specific Records from DualChallengerDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromDualChallengerDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("DualChallengerRecordQueryUtils.retrieveRecordFromDualChallengerDetailsDatabase : Successfully retrieved queried records => ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "DualChallengerRecordQueryUtils.retrieveRecordFromDualChallengerDetailsDatabase : Null Records returned for DualChallengerDetails Record query";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromDualChallengerDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);
        });

    } else {

        dbConnection.collection(collectionName).find({}).toArray(function (err, result) {

            if (err) {

                var failureMessage = "DualChallengerRecordQueryUtils.retrieveRecordFromDualChallengerDetailsDatabase : Internal Server Error while querying for all the Records from DualChallengerDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromDualChallengerDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("DualChallengerRecordQueryUtils.retrieveRecordFromDualChallengerDetailsDatabase : Successfully retrieved all the records => ");
            console.log(result);

            if ( !HelperUtilsModule.valueDefined(result) ) {

                var failureMessage = "DualChallengerRecordQueryUtils.retrieveRecordFromDualChallengerDetailsDatabase : Null Records returned for DualChallengerDetails Record query For All Records";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromDualChallengerDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);

        });

    }

}

