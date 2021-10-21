
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * All CRUD Operations of Team Records
 * 
 **************************************************************************
 **************************************************************************
 */


var HelperUtilsModule = require('./HelperUtils');
var MongoDbCrudModule = require('./MongoDbCRUD');
var RecordHelperUtilsModule = require('./RecordHelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var QueryBuilderModule = require('./QueryBuilder');


/**********************************************************************************
 **********************************************************************************
 **********************************************************************************
 * 
 * Team Records : CRUD operations Wrappers Module for Update/Add/Remove 
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
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to Team database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addTeamRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection, http_response) {


    // Check if all the required fields are present before adding the record

    for (var i = 0; i < requiredDetailsCollection.length; i++) {

        var currentKey = requiredDetailsCollection[i];

        if (recordObjectMap.get(currentKey) == null) {

            console.error("TeamRecordUpdateUtils.addTeamRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey);

            var failureMessage = "TeamRecordUpdateUtils.addTeamRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey;
            HelperUtilsModule.logBadHttpRequestError("addTeamRecordToDatabase", failureMessage, http_response);

            return;
        }

    }

    console.log("addTeamRecordToDatabase : All <K,V> pairs are present, Adding Team Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the Team Object and add to the Team Details Database

    var teamRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    // Remove spaces from team_object values before adding to MongoDB

    teamRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(teamRecordObject);

    checkUniquenessAndAddTeamRecord(dbConnection,
        collectionName,
        teamRecordObject,
        "AddTeamRecord",
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

function addRecordToTeamDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Add Otherwise

    var query = null;

    console.log("addRecordToTeamDetailsDatabase => collectionName :" + collectionName + ", Team_Id :" + document_Object.Team_Id);

    if ( HelperUtilsModule.valueDefined(document_Object.Team_Id) ) {

        query = { Team_Id: document_Object.Team_Id };
    }

    if (query) {

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("TeamRecordUpdateUtils.addRecordToTeamDetailsDatabase : Internal Server Error while querying for record to be inserted");

                var failureMessage = "TeamRecordUpdateUtils.addRecordToTeamDetailsDatabase : Internal Server Error while querying for record to be inserted";
                HelperUtilsModule.logInternalServerError("addRecordToTeamDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Record Not Found, Adding New Record => " + " Team_Id : " + document_Object.Team_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
            }
            else {

                // Record Updation

                console.log("Record Found, Updating the existing Record => " + " Team_Id : " + document_Object.Team_Id);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    } else {

        // Record Addition

        console.log("No Team_Id in input Object, Adding New Record without primary keys");
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

function checkUniquenessAndAddTeamRecord(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Add Otherwise

    console.log("TeamRecordUpdateUtils.checkUniquenessAndAddTeamRecord => collectionName :" + collectionName +
        ", Team_Id :" + document_Object.Team_Id);

    // Build Uniqueness Query
    
    var queryObjectForUniqueTeamId = { Team_Id: document_Object.Team_Id };
    var queryObjectForGroupValueChecks = QueryBuilderModule.buildQuery_MatchAllFields(GlobalsForServiceModule.team_RecordData_AtleastOneValueShouldBeDifferent,
        document_Object);
    var queryObjectForSameNameChecks = QueryBuilderModule.buildQuery_MatchAllFields(GlobalsForServiceModule.team_RecordData_NameFileds,
        document_Object);

    var queryObjectLogicalIntermediate = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(queryObjectForGroupValueChecks,
        queryObjectForUniqueTeamId, "$or");
    var checkUniquenessQuery = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(queryObjectLogicalIntermediate,
        queryObjectForSameNameChecks, "$or");

    // Add Team Record after uniqueness checks

    if (checkUniquenessQuery) {

        dbConnection.collection(collectionName).findOne(checkUniquenessQuery, function (err, result) {

            if (err) {

                console.error("TeamRecordUpdateUtils.checkUniquenessAndAddTeamRecord : " +
                    " Internal Server Error while querying for uniqueness of team Record");

                var failureMessage = "TeamRecordUpdateUtils.checkUniquenessAndAddTeamRecord : " +
                    " Internal Server Error while querying for uniqueness of team Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessAndAddTeamRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Uniqueness checks passed, Adding New Record => " + " Team_Id : " + document_Object.Team_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
            }
            else {

                // Uniqueness checks failed. Returning Error

                console.error("TeamRecordUpdateUtils.checkUniquenessAndAddTeamRecord : " +
                    " Record already exists with current record values : uniqueness of team record was not satisfied => " +
                    " Team_Id, Team Name & Team Home Ground must be unique. For a particular team name atleast one of other record values must be different");

                var failureMessage = "TeamRecordUpdateUtils.checkUniquenessAndAddTeamRecord : " +
                    " Record already exists with current record values : uniqueness of team record was not satisfied => " +
                    " Team_Id, Team Name & Team Home Ground must be unique. For a particular team name atleast one of other record values must be different";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessAndAddTeamRecord", failureMessage, http_response);

                return;
            }

        });

    } else {

        console.error("TeamRecordUpdateUtils.checkUniquenessAndAddTeamRecord : " +
            " Internal Server Error while building uniqueness query of team Record");

        var failureMessage = "TeamRecordUpdateUtils.checkUniquenessAndAddTeamRecord : " +
            " Internal Server Error while building uniqueness query of team Record";
        HelperUtilsModule.logInternalServerError("checkUniquenessAndAddTeamRecord", failureMessage, http_response);

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be updated in Team Details database
 * @param {Collection} updateRecordKeys : Required keys for record updation
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.updateTeamRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, updateRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("TeamRecordUpdateUtils.updateTeamRecordInDatabase : Update record based on input <k,v> pairs of Client Request : ");

    // Prepare the Team Object and update it in the Team Details Database

    var teamRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, updateRecordKeys);

    // Remove spaces from team_object values before updating record in MongoDB

    teamRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(teamRecordObject);

    updateRecordInTeamDetailsDatabase(dbConnection,
        collectionName,
        teamRecordObject,
        "UpdateTeamRecord",
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

function updateRecordInTeamDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Return Error response otherwise

    var query = null;

    console.log("TeamRecordUpdateUtils.updateRecordToTeamDetailsDatabase => collectionName :" + collectionName +
        ", Team_Id :" + document_Object.Team_Id);

    if (HelperUtilsModule.valueDefined(document_Object.Team_Id)) {

        query = { Team_Id: document_Object.Team_Id };
    }

    if (query == null) {

        // Team_Id not present in input : Return Record Not present Error

        console.error("TeamRecordUpdateUtils.updateRecordToTeamDetailsDatabase : " +
            " Team_Id must be present in input request to update team details in database");

        var failureMessage = "TeamRecordUpdateUtils.updateRecordToTeamDetailsDatabase : " +
            " Team_Id must be present in input request to update team details in database";
        HelperUtilsModule.logBadHttpRequestError("updateRecordToTeamDetailsDatabase", failureMessage, http_response);

    } else {

        // Team_Id present in input : Add / Update Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("TeamRecordUpdateUtils.updateRecordToTeamDetailsDatabase : Internal Server Error while querying for record to be updated");

                var failureMessage = "TeamRecordUpdateUtils.updateRecordToTeamDetailsDatabase : Internal Server Error while querying for record to be updated";
                HelperUtilsModule.logInternalServerError("updateRecordToTeamDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("TeamRecordUpdateUtils.updateRecordToTeamDetailsDatabase : Requested Record is not present in team details database");

                var failureMessage = "TeamRecordUpdateUtils.updateRecordToTeamDetailsDatabase : Requested Record is not present in team details database";
                HelperUtilsModule.logBadHttpRequestError("updateRecordToTeamDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Updation

                console.log("Record Found, Updating the existing Record => " + " Team_Id : " + document_Object.Team_Id);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be removed from Team details database
 * @param {Collection} removeRecordKeys : Required keys for record removal
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.removeTeamRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, removeRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("TeamRecordRemoveUtils.removeTeamRecordInDatabase : Remove record based on input <k,v> pairs of Client Request : ");

    // Prepare the Team Object and remove it from the Team Details Database

    var teamRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, removeRecordKeys);

    // Remove spaces from team_object values before removing from MongoDB

    teamRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(teamRecordObject);

    removeRecordFromTeamDetailsDatabase(dbConnection,
        collectionName,
        teamRecordObject,
        "RemoveTeamRecord",
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

function removeRecordFromTeamDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Remove if Present ; Return Error response otherwise

    var query = new Object();

    console.log("TeamRecordRemoveUtils.removeRecordFromTeamDetailsDatabase => collectionName :" + collectionName +
        ", Team_Id :" + document_Object.Team_Id);

    // ToDo : Remove Team based on other unique fields => Team Name

    if (HelperUtilsModule.valueDefined(document_Object.Team_Id)) {

        query.Team_Id = document_Object.Team_Id;
    }

    if (query == null) {

        // Team_Id not present in input : Return Record Not present Error

        console.error("TeamRecordRemoveUtils.removeRecordFromTeamDetailsDatabase : " +
            " Team_Id must be present in input request to remove team details in database");

        var failureMessage = "TeamRecordRemoveUtils.removeRecordFromTeamDetailsDatabase : " +
            " Team_Id must be present in input request to remove team details in database";
        HelperUtilsModule.logBadHttpRequestError("removeRecordFromTeamDetailsDatabase", failureMessage, http_response);

    } else {

        // Team_Id present in input : Add / Remove Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("TeamRecordRemoveUtils.removeRecordFromTeamDetailsDatabase : Internal Server Error while querying for record to be removed");

                var failureMessage = "TeamRecordRemoveUtils.removeRecordFromTeamDetailsDatabase : Internal Server Error while querying for record to be removed";
                HelperUtilsModule.logInternalServerError("removeRecordFromTeamDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("TeamRecordRemoveUtils.removeRecordFromTeamDetailsDatabase : Requested Record is not present in team details database");

                var failureMessage = "TeamRecordRemoveUtils.removeRecordFromTeamDetailsDatabase : Requested Record is not present in team details database";
                HelperUtilsModule.logBadHttpRequestError("removeRecordFromTeamDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Removal

                console.log("Record Found, Removing the existing Record => " + " Team_Id : " + document_Object.Team_Id);
                MongoDbCrudModule.removeRecordFromDatabase(dbConnection, collectionName, query, clientRequest, http_response);

            }

        });

    }

}


