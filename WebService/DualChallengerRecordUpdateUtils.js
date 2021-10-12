
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * All CRUD Operations of DualChallenger Records
 * 
 **************************************************************************
 **************************************************************************
 */


var HelperUtilsModule = require('./HelperUtils');
var MongoDbCrudModule = require('./MongoDbCRUD');
var RecordHelperUtilsModule = require('./RecordHelperUtils');
var ExpenseRecordsUpdateModule = require('./ExpenseRecordUpdateUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var QueryBuilderModule = require('./QueryBuilder');


/**********************************************************************************
 **********************************************************************************
 **********************************************************************************
 * 
 * DualChallenger Records : CRUD operations Wrappers Module for Update/Add/Remove 
 *                  DB Specific User Input/Output processing
 * 
 **********************************************************************************
 **********************************************************************************
 */


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to DualChallenger database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addDualChallengerRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection, http_response) {


    // Check if all the required fields are present before adding the record

    for (var i = 0; i < requiredDetailsCollection.length; i++) {

        var currentKey = requiredDetailsCollection[i];

        if (recordObjectMap.get(currentKey) == null) {

            console.error("DualChallengerRecordUpdateUtils.addDualChallengerRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey);

            var failureMessage = "DualChallengerRecordUpdateUtils.addDualChallengerRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey;
            HelperUtilsModule.logBadHttpRequestError("addDualChallengerRecordToDatabase", failureMessage, http_response);

            return;
        }

    }

    console.log("addDualChallengerRecordToDatabase : All <K,V> pairs are present, Adding DualChallenger Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the DualChallenger Object and add to the DualChallenger Details Database

    var dualChallengerRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    // Remove spaces from dualChallenger_object values before adding to MongoDB

    dualChallengerRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(dualChallengerRecordObject);

    //addRecordToDualChallengerDetailsDatabase(dbConnection,
    checkUniquenessAndAddDualChallengerRecord(dbConnection,
        collectionName,
        dualChallengerRecordObject,
        "AddDualChallengerRecord",
        http_response);

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be added ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

function addRecordToDualChallengerDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Add Otherwise

    var query = null;

    console.log("addRecordToDualChallengerDetailsDatabase => collectionName :" + collectionName + ", DualChallenger_Id :" + document_Object.DualChallenger_Id);

    if ( HelperUtilsModule.valueDefined(document_Object.DualChallenger_Id) ) {

        query = { DualChallenger_Id: document_Object.DualChallenger_Id };
    }

    if (query) {

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("DualChallengerRecordUpdateUtils.addRecordToDualChallengerDetailsDatabase : Internal Server Error while querying for record to be inserted");

                var failureMessage = "DualChallengerRecordUpdateUtils.addRecordToDualChallengerDetailsDatabase : Internal Server Error while querying for record to be inserted";
                HelperUtilsModule.logInternalServerError("addRecordToDualChallengerDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Record Not Found, Adding New Record => " + " DualChallenger_Id : " + document_Object.DualChallenger_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
            }
            else {

                // Record Updation

                console.log("Record Found, Updating the existing Record => " + " DualChallenger_Id : " + document_Object.DualChallenger_Id);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    } else {

        // Record Addition

        console.log("No DualChallenger_Id in input Object, Adding New Record without primary keys");
        MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be added ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

function checkUniquenessAndAddDualChallengerRecord(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Add Otherwise

    console.log("DualChallengerRecordUpdateUtils.checkUniquenessAndAddDualChallengerRecord => collectionName :" + collectionName +
        ", DualChallenger_Id :" + document_Object.DualChallenger_Id);

    // Build Uniqueness Query
    
    var queryObjectForUniqueDualChallengerId = { DualChallenger_Id: document_Object.DualChallenger_Id };
    var queryObjectForGroupValueChecks = QueryBuilderModule.buildQuery_MatchAllFields(GlobalsForServiceModule.dualChallenger_RecordData_AtleastOneValueShouldBeDifferent,
        document_Object);
    /*var queryObjectForSameNameChecks = QueryBuilderModule.buildQuery_MatchAllFields(GlobalsForServiceModule.dualChallengerRecordData_NameFileds,
        document_Object);*/

    var checkUniquenessQuery = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(queryObjectForGroupValueChecks,
        queryObjectForUniqueDualChallengerId, "$or");
    /*var checkUniquenessQuery = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(queryObjectLogicalIntermediate,
        queryObjectForSameNameChecks, "$or");*/

    // Add DualChallenger Record after uniqueness checks

    if (checkUniquenessQuery) {

        dbConnection.collection(collectionName).findOne(checkUniquenessQuery, function (err, result) {

            if (err) {

                console.error("DualChallengerRecordUpdateUtils.checkUniquenessAndAddDualChallengerRecord : " +
                    " Internal Server Error while querying for uniqueness of dualChallenger Record");

                var failureMessage = "DualChallengerRecordUpdateUtils.checkUniquenessAndAddDualChallengerRecord : " +
                    " Internal Server Error while querying for uniqueness of dualChallenger Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessAndAddDualChallengerRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Uniqueness checks passed, Adding New Record => " + " DualChallenger_Id : " + document_Object.DualChallenger_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
            }
            else {

                // Uniqueness checks failed. Returning Error

                console.error("DualChallengerRecordUpdateUtils.checkUniquenessAndAddDualChallengerRecord : " +
                    " Record already exists with current record values : uniqueness of dualChallenger record was not satisfied => " +
                    " DualChallenger_Id must be unique. For a particular dualChallenger name atleast one of other record values must be different");

                var failureMessage = "DualChallengerRecordUpdateUtils.checkUniquenessAndAddDualChallengerRecord : " +
                    " Record already exists with current record values : uniqueness of dualChallenger record was not satisfied => " +
                    " DualChallenger_Id must be unique. For a particular dualChallenger name atleast one of other record values must be different";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessAndAddDualChallengerRecord", failureMessage, http_response);

                return;
            }

        });

    } else {

        console.error("DualChallengerRecordUpdateUtils.checkUniquenessAndAddDualChallengerRecord : " +
            " Internal Server Error while building uniqueness query of dualChallenger Record");

        var failureMessage = "DualChallengerRecordUpdateUtils.checkUniquenessAndAddDualChallengerRecord : " +
            " Internal Server Error while building uniqueness query of dualChallenger Record";
        HelperUtilsModule.logInternalServerError("checkUniquenessAndAddDualChallengerRecord", failureMessage, http_response);

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be updated in DualChallenger Details database
 * @param {Collection} updateRecordKeys : Required keys for record updation
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.updateDualChallengerRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, updateRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("DualChallengerRecordUpdateUtils.updateDualChallengerRecordInDatabase : Update record based on input <k,v> pairs of Client Request : ");

    // Prepare the DualChallenger Object and update it in the DualChallenger Details Database

    var dualChallengerRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, updateRecordKeys);

    // Remove spaces from dualChallenger_object values before updating record in MongoDB

    dualChallengerRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(dualChallengerRecordObject);

    updateRecordInDualChallengerDetailsDatabase(dbConnection,
        collectionName,
        dualChallengerRecordObject,
        "UpdateDualChallengerRecord",
        http_response);

    console.log("Web Service: Switch Statement : Successfully launched the update Record DB Request API : ");
}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be updated ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

function updateRecordInDualChallengerDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Return Error response otherwise

    var query = null;

    console.log("DualChallengerRecordUpdateUtils.updateRecordToDualChallengerDetailsDatabase => collectionName :" + collectionName +
        ", DualChallenger_Id :" + document_Object.DualChallenger_Id);

    if (HelperUtilsModule.valueDefined(document_Object.DualChallenger_Id)) {

        query = { DualChallenger_Id: document_Object.DualChallenger_Id };
    }

    if (query == null) {

        // DualChallenger_Id not present in input : Return Record Not present Error

        console.error("DualChallengerRecordUpdateUtils.updateRecordToDualChallengerDetailsDatabase : " +
            " DualChallenger_Id must be present in input request to update dualChallenger details in database");

        var failureMessage = "DualChallengerRecordUpdateUtils.updateRecordToDualChallengerDetailsDatabase : " +
            " DualChallenger_Id must be present in input request to update dualChallenger details in database";
        HelperUtilsModule.logBadHttpRequestError("updateRecordToDualChallengerDetailsDatabase", failureMessage, http_response);

    } else {

        // DualChallenger_Id present in input : Add / Update Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("DualChallengerRecordUpdateUtils.updateRecordToDualChallengerDetailsDatabase : Internal Server Error while querying for record to be updated");

                var failureMessage = "DualChallengerRecordUpdateUtils.updateRecordToDualChallengerDetailsDatabase : Internal Server Error while querying for record to be updated";
                HelperUtilsModule.logInternalServerError("updateRecordToDualChallengerDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("DualChallengerRecordUpdateUtils.updateRecordToDualChallengerDetailsDatabase : Requested Record is not present in dualChallenger details database");

                var failureMessage = "DualChallengerRecordUpdateUtils.updateRecordToDualChallengerDetailsDatabase : Requested Record is not present in dualChallenger details database";
                HelperUtilsModule.logBadHttpRequestError("updateRecordToDualChallengerDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Updation

                console.log("Record Found, Updating the existing Record => " + " DualChallenger_Id : " + document_Object.DualChallenger_Id);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be removed from DualChallenger details database
 * @param {Collection} removeRecordKeys : Required keys for record removal
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.removeDualChallengerRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, removeRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("DualChallengerRecordRemoveUtils.removeDualChallengerRecordInDatabase : Remove record based on input <k,v> pairs of Client Request : ");

    // Prepare the DualChallenger Object and remove it from the DualChallenger Details Database

    var dualChallengerRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, removeRecordKeys);

    // Remove spaces from dualChallenger_object values before removing from MongoDB

    dualChallengerRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(dualChallengerRecordObject);

    removeRecordFromDualChallengerDetailsDatabase(dbConnection,
        collectionName,
        dualChallengerRecordObject,
        "RemoveDualChallengerRecord",
        http_response);

    console.log("Web Service: Switch Statement : Successfully launched the Remove Record DB API Request : ");
}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be removed ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

function removeRecordFromDualChallengerDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Remove if Present ; Return Error response otherwise

    var query = new Object();

    console.log("DualChallengerRecordRemoveUtils.removeRecordFromDualChallengerDetailsDatabase => collectionName :" + collectionName +
        ", DualChallenger_Id :" + document_Object.DualChallenger_Id);

    if (HelperUtilsModule.valueDefined(document_Object.DualChallenger_Id)) {

        query.DualChallenger_Id = document_Object.DualChallenger_Id;
    }

    if (query == null) {

        // DualChallenger_Id not present in input : Return Record Not present Error

        console.error("DualChallengerRecordRemoveUtils.removeRecordFromDualChallengerDetailsDatabase : " +
            " DualChallenger_Id must be present in input request to remove dualChallenger details in database");

        var failureMessage = "DualChallengerRecordRemoveUtils.removeRecordFromDualChallengerDetailsDatabase : " +
            " DualChallenger_Id must be present in input request to remove dualChallenger details in database";
        HelperUtilsModule.logBadHttpRequestError("removeRecordFromDualChallengerDetailsDatabase", failureMessage, http_response);

    } else {

        // DualChallenger_Id present in input : Add / Remove Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("DualChallengerRecordRemoveUtils.removeRecordFromDualChallengerDetailsDatabase : Internal Server Error while querying for record to be removed");

                var failureMessage = "DualChallengerRecordRemoveUtils.removeRecordFromDualChallengerDetailsDatabase : Internal Server Error while querying for record to be removed";
                HelperUtilsModule.logInternalServerError("removeRecordFromDualChallengerDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("DualChallengerRecordRemoveUtils.removeRecordFromDualChallengerDetailsDatabase : Requested Record is not present in dualChallenger details database");

                var failureMessage = "DualChallengerRecordRemoveUtils.removeRecordFromDualChallengerDetailsDatabase : Requested Record is not present in dualChallenger details database";
                HelperUtilsModule.logBadHttpRequestError("removeRecordFromDualChallengerDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Removal

                console.log("Record Found, Removing the existing Record => " + " DualChallenger_Id : " + document_Object.DualChallenger_Id);
                MongoDbCrudModule.removeRecordFromDatabase(dbConnection, collectionName, query, clientRequest, http_response);

            }

        });

    }

}


