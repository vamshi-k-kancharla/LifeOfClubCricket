
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Module to retrieve generic records based on input queries
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
 * Generic Records : CRUD operations Wrappers Module for Queries
 *                  DB Specific User Input/Output processing
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {Object} queryResult  : Result object of the Web Cient query
 * @param {XMLHttpRequest} http_request  : http request passed from web service handler
 * @param {String} generic_IdKey : Id Key of Generic Input Record
 * @param {Collection} recordFields : required keys for record result based on expected keys
 * 
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.handleQueryResults = function (queryResult, generic_IdKey, recordFields, http_response) {

    console.log("Callback Function (handleQueryResults) : Successfully retrieved the records through function " +
        "(mongoDbCrudModule.retrieveRecordsFromDatabase) => ");
    console.log(queryResult);

    var queryResponse_JSON_String = buildQueryResponse_JSON(queryResult, generic_IdKey, recordFields);

    // Build Success Response with Query Results

    http_response.writeHead(200, { 'Content-Type': 'application/json' });
    http_response.end(queryResponse_JSON_String);

    console.log("GenericRecordQueryUtils.handleQueryResults: Written Success response for input query : Response => " +
        queryResponse_JSON_String);
}


/**
 * 
 * @param {Object} queryResult  : query Response received from Mongo DB
 * @param {String} generic_IdKey : Id Key of Generic Input Record
 * @param {Collection} recordFields : required keys for record result based on expected keys
 * 
 * @returns {String} queryResponse_GenericRecord_JSON_String  : JSON String of Retrieved Generic Record(s)
 *
 */

function buildQueryResponse_JSON(queryResult, generic_IdKey, recordFields) {

    var queryResponse_GenericRecord_JSON_String = "";

    for (var i = 0; i < queryResult.length; i++) {

        var currentRecord = queryResult[i];

        if (HelperUtilsModule.valueDefined(currentRecord[generic_IdKey]) ) {

            queryResponse_GenericRecord_JSON_String += JSON.stringify(RecordHelperUtilsModule.buildJSONRecord(currentRecord,
                recordFields));

            if (i != queryResult.length - 1) {

                queryResponse_GenericRecord_JSON_String += "\n";
            }
        }

    }

    return queryResponse_GenericRecord_JSON_String;
}


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Generic Details Record Query Processing & Response Building
 * 
 **************************************************************************
 **************************************************************************
 */

/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database 
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} clientRequestWithParamsMap : Map of <K,V> Pairs ( Record ) used to generate LC
 * @param {Function} handleQueryResults  : Call back function to handle the Query Results
 * @param {String} generic_IdKey : Id Key of Generic Input Record
 * @param {Collection} recordFields : required keys for record result based on expected keys
 *
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.retrieveInputGenericRecordFromDatabase = function (dbConnection, collectionName, clientRequestWithParamsMap,
    generic_IdKey, recordFields, handleQueryResults, http_response) {

    var queryObject = new Object();

    var genericRecordDetails = recordFields;
    var parameterList = " ";

    // Fill the record document object values

    for (var currentDetailOfRecord of genericRecordDetails) {

        if( HelperUtilsModule.valueDefined(clientRequestWithParamsMap.get(currentDetailOfRecord)) ) {

            parameterList += currentDetailOfRecord;
            parameterList += " : ";
            parameterList += clientRequestWithParamsMap.get(currentDetailOfRecord);
            parameterList += ", ";

            queryObject[currentDetailOfRecord] = clientRequestWithParamsMap.get(currentDetailOfRecord);
        }
    }

    console.log("GenericRecordQueryUtils.retrieveRecordFromGenericDetailsDatabase => collectionName :" + collectionName);
    console.log("GenericRecordQueryUtils.retrieveRecordFromGenericDetailsDatabase : Called with Parameter List : " + parameterList);

    // Remove URL representation of spaces

    queryObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryObject);

    // Query for Generic Records

    if (Object.keys(queryObject).length > 0) {

        dbConnection.collection(collectionName).find(queryObject).toArray(function (err, result) {

            if (err) {

                var failureMessage = "GenericRecordQueryUtils.retrieveRecordFromGenericDetailsDatabase : Internal Server Error while querying for specific Records from GenericDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromGenericDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("GenericRecordQueryUtils.retrieveRecordFromGenericDetailsDatabase : Successfully retrieved queried records => ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "GenericRecordQueryUtils.retrieveRecordFromGenericDetailsDatabase : Null Records returned for GenericDetails Record query";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromGenericDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, generic_IdKey, recordFields, http_response);
        });

    } else {

        dbConnection.collection(collectionName).find({}).toArray(function (err, result) {

            if (err) {

                var failureMessage = "GenericRecordQueryUtils.retrieveRecordFromGenericDetailsDatabase : Internal Server Error while querying for all the Records from GenericDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromGenericDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("GenericRecordQueryUtils.retrieveRecordFromGenericDetailsDatabase : Successfully retrieved all the records => ");
            console.log(result);

            if ( !HelperUtilsModule.valueDefined(result) ) {

                var failureMessage = "GenericRecordQueryUtils.retrieveRecordFromGenericDetailsDatabase : Null Records returned for GenericDetails Record query For All Records";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromGenericDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, generic_IdKey, recordFields, http_response);

        });

    }

}

