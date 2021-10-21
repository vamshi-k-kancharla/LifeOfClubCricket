
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * All CRUD Operations of Generic Records
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
 * Generic Records : CRUD operations Wrappers Module for Update/Add/Remove 
 *                  DB Specific User Input/Output processing
 * 
 **********************************************************************************
 **********************************************************************************
 */


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to Generic database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {String} generic_IdKey : Id Key of Generic Input Record
 * @param {Collection} recordData_AtleastOneValueShouldBeDifferent : required data keys for Query Validation ( Atleast one of given Record Values should be different )
 * @param {Collection} recordData_NameFileds : required data keys for Query Validation ( Name Fields that are supposed to be unique )
 * 
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addGenericRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection, 
    generic_IdKey, recordData_AtleastOneValueShouldBeDifferent, recordData_NameFileds,
    http_response) {


    // Check if all the required fields are present before adding the record

    for (var i = 0; i < requiredDetailsCollection.length; i++) {

        var currentKey = requiredDetailsCollection[i];

        if (recordObjectMap.get(currentKey) == null) {

            console.error("GenericRecordUpdateUtils.addGenericRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey);

            var failureMessage = "GenericRecordUpdateUtils.addGenericRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey;
            HelperUtilsModule.logBadHttpRequestError("addGenericRecordToDatabase", failureMessage, http_response);

            return;
        }

    }

    console.log("addGenericRecordToDatabase : All <K,V> pairs are present, Adding Generic Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the Generic Object and add to the Generic Details Database

    var genericRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    // Remove spaces from generic_object values before adding to MongoDB

    genericRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(genericRecordObject);

    checkUniquenessAndAddGenericRecord(dbConnection,
        collectionName,
        genericRecordObject,
        "AddGenericRecord",
        generic_IdKey, 
        recordData_AtleastOneValueShouldBeDifferent, 
        recordData_NameFileds,
        http_response);

}



/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be added ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {String} generic_IdKey : Id Key of Generic Input Record
 * @param {Collection} recordData_AtleastOneValueShouldBeDifferent : required data keys for Query Validation ( Atleast one of given Record Values should be different )
 * @param {Collection} recordData_NameFileds : required data keys for Query Validation ( Name Fields that are supposed to be unique )
 * 
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

function checkUniquenessAndAddGenericRecord(dbConnection, collectionName, document_Object, clientRequest, 
    generic_IdKey, recordData_AtleastOneValueShouldBeDifferent, recordData_NameFileds,
    http_response) {

    // Update if Present ; Add Otherwise

    console.log("GenericRecordUpdateUtils.checkUniquenessAndAddGenericRecord => collectionName :" + collectionName +
        ", " + generic_IdKey + " : " + document_Object[generic_IdKey]);

    // Build Uniqueness Query
    
    var queryObjectForUniqueGenericId = new Object();
    queryObjectForUniqueGenericId[generic_IdKey] = document_Object[generic_IdKey];

    var queryObjectForGroupValueChecks = QueryBuilderModule.buildQuery_MatchAllFields(
        recordData_AtleastOneValueShouldBeDifferent, document_Object);
    var queryObjectForSameNameChecks = QueryBuilderModule.buildQuery_MatchAllFields(
        recordData_NameFileds, document_Object);

    var queryObjectLogicalIntermediate = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(
        queryObjectForGroupValueChecks, queryObjectForUniqueGenericId, "$or");
    var checkUniquenessQuery = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(
        queryObjectLogicalIntermediate, queryObjectForSameNameChecks, "$or");

    // Add Generic Record after uniqueness checks

    if (checkUniquenessQuery) {

        dbConnection.collection(collectionName).findOne(checkUniquenessQuery, function (err, result) {

            if (err) {

                console.error("GenericRecordUpdateUtils.checkUniquenessAndAddGenericRecord : " +
                    " Internal Server Error while querying for uniqueness of generic Record");

                var failureMessage = "GenericRecordUpdateUtils.checkUniquenessAndAddGenericRecord : " +
                    " Internal Server Error while querying for uniqueness of generic Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessAndAddGenericRecord", failureMessage, 
                http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Uniqueness checks passed, Adding New Record => " + " generic_IdKey : " + document_Object[generic_IdKey]);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
            }
            else {

                // Uniqueness checks failed. Returning Error

                console.error("GenericRecordUpdateUtils.checkUniquenessAndAddGenericRecord : " +
                    " Record already exists with current record values : uniqueness of generic record was not satisfied => " +
                    " Id & Name Key Values must be unique. For a particular record name atleast one of other record values must be different");

                var failureMessage = "GenericRecordUpdateUtils.checkUniquenessAndAddGenericRecord : " +
                    " Record already exists with current record values : uniqueness of generic record was not satisfied => " +
                    " Id & Name Key Values must be unique. For a particular record name atleast one of other record values must be different";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessAndAddGenericRecord", failureMessage, http_response);

                return;
            }

        });

    } else {

        console.error("GenericRecordUpdateUtils.checkUniquenessAndAddGenericRecord : " +
            " Internal Server Error while building uniqueness query of generic Record");

        var failureMessage = "GenericRecordUpdateUtils.checkUniquenessAndAddGenericRecord : " +
            " Internal Server Error while building uniqueness query of generic Record";
        HelperUtilsModule.logInternalServerError("checkUniquenessAndAddGenericRecord", failureMessage, http_response);

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be updated in Generic Details database
 * @param {Collection} updateRecordKeys : Required keys for record updation
 * @param {String} generic_IdKey : Id Key of Generic Input Record
 *
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.updateGenericRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, updateRecordKeys, 
    generic_IdKey, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("GenericRecordUpdateUtils.updateGenericRecordInDatabase : Update record based on input <k,v> pairs of Client Request : ");

    // Prepare the Generic Object and update it in the Generic Details Database

    var genericRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, updateRecordKeys);

    // Remove spaces from generic_object values before updating record in MongoDB

    genericRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(genericRecordObject);

    updateRecordInGenericDetailsDatabase(dbConnection,
        collectionName,
        genericRecordObject,
        "UpdateGenericRecord",
        generic_IdKey,
        http_response);

    console.log("Web Service: Switch Statement : Successfully launched the update Record DB Request API : ");
}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be updated ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {String} generic_IdKey : Id Key of Generic Input Record
 *
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

function updateRecordInGenericDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, 
    generic_IdKey, http_response) {

    // Update if Present ; Return Error response otherwise

    var query = new Object();

    console.log("GenericRecordUpdateUtils.updateRecordToGenericDetailsDatabase => collectionName :" + collectionName +
        ", " + generic_IdKey + " : " + document_Object[generic_IdKey]);

    if (HelperUtilsModule.valueDefined(document_Object[generic_IdKey])) {

        query[generic_IdKey] = document_Object[generic_IdKey];

    } else {

        console.error("GenericRecordUpdateUtils.updateRecordToGenericDetailsDatabase : Id Key missing from Input Update Record");

        var failureMessage = "GenericRecordUpdateUtils.updateRecordToGenericDetailsDatabase : Internal Server Error while querying for record to be updated";
        HelperUtilsModule.logBadHttpRequestError("updateRecordToGenericDetailsDatabase", failureMessage, http_response);

        return;
    }

    if (query == null) {

        // generic_IdKey not present in input : Return Record Not present Error

        console.error("GenericRecordUpdateUtils.updateRecordToGenericDetailsDatabase : " +
            generic_IdKey + " must be present in input request to update generic details in database");

        var failureMessage = "GenericRecordUpdateUtils.updateRecordToGenericDetailsDatabase : " +
            generic_IdKey + " must be present in input request to update generic details in database";
        HelperUtilsModule.logBadHttpRequestError("updateRecordToGenericDetailsDatabase", failureMessage, http_response);

    } else {

        // generic_IdKey present in input : Add / Update Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("GenericRecordUpdateUtils.updateRecordToGenericDetailsDatabase : Internal Server Error while querying for record to be updated");

                var failureMessage = "GenericRecordUpdateUtils.updateRecordToGenericDetailsDatabase : Internal Server Error while querying for record to be updated";
                HelperUtilsModule.logInternalServerError("updateRecordToGenericDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("GenericRecordUpdateUtils.updateRecordToGenericDetailsDatabase : Requested Record is not present in generic details database");

                var failureMessage = "GenericRecordUpdateUtils.updateRecordToGenericDetailsDatabase : Requested Record is not present in generic details database";
                HelperUtilsModule.logBadHttpRequestError("updateRecordToGenericDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Updation

                console.log("Record Found, Updating the existing Record => " + generic_IdKey + " : " + document_Object[generic_IdKey]);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, 
                    clientRequest, http_response);
            }

        });

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be removed from Generic details database
 * @param {Collection} removeRecordKeys : Required keys for record removal
 * @param {String} generic_IdKey : Id Key of Generic Input Record
 *
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.removeGenericRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, removeRecordKeys, 
    generic_IdKey, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("GenericRecordRemoveUtils.removeGenericRecordInDatabase : Remove record based on input <k,v> pairs of Client Request : ");

    // Prepare the Generic Object and remove it from the Generic Details Database

    var genericRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, removeRecordKeys);

    // Remove spaces from generic_object values before removing from MongoDB

    genericRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(genericRecordObject);

    removeRecordFromGenericDetailsDatabase(dbConnection,
        collectionName,
        genericRecordObject,
        "RemoveGenericRecord",
        generic_IdKey,
        http_response);

    console.log("Web Service: Switch Statement : Successfully launched the Remove Record DB API Request : ");
}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be removed ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {String} generic_IdKey : Id Key of Generic Input Record
 *
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

function removeRecordFromGenericDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, 
    generic_IdKey, http_response) {

    // Remove if Present ; Return Error response otherwise

    var query = null;

    console.log("GenericRecordRemoveUtils.removeRecordFromGenericDetailsDatabase => collectionName :" + collectionName +
        ", " + generic_IdKey + " : " + document_Object[generic_IdKey]);

    // ToDo : Remove Generic based on other unique fields => Generic Name

    if (HelperUtilsModule.valueDefined(document_Object[generic_IdKey])) {

        var query = new Object();
        query[generic_IdKey] = document_Object[generic_IdKey];
    }

    if (query == null) {

        // generic_IdKey not present in input : Return Record Not present Error

        console.error("GenericRecordRemoveUtils.removeRecordFromGenericDetailsDatabase : " +
            generic_IdKey + " must be present in input request to remove generic details in database");

        var failureMessage = "GenericRecordRemoveUtils.removeRecordFromGenericDetailsDatabase : " +
            generic_IdKey + " must be present in input request to remove generic details in database";
        HelperUtilsModule.logBadHttpRequestError("removeRecordFromGenericDetailsDatabase", failureMessage, http_response);

    } else {

        // generic_IdKey present in input : Add / Remove Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("GenericRecordRemoveUtils.removeRecordFromGenericDetailsDatabase : Internal Server Error while querying for record to be removed");

                var failureMessage = "GenericRecordRemoveUtils.removeRecordFromGenericDetailsDatabase : Internal Server Error while querying for record to be removed";
                HelperUtilsModule.logInternalServerError("removeRecordFromGenericDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("GenericRecordRemoveUtils.removeRecordFromGenericDetailsDatabase : Requested Record is not present in generic details database");

                var failureMessage = "GenericRecordRemoveUtils.removeRecordFromGenericDetailsDatabase : Requested Record is not present in generic details database";
                HelperUtilsModule.logBadHttpRequestError("removeRecordFromGenericDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Removal

                console.log("Record Found, Removing the existing Record => " + generic_IdKey + " : " + document_Object[generic_IdKey]);
                MongoDbCrudModule.removeRecordFromDatabase(dbConnection, collectionName, query, clientRequest, http_response);

            }

        });

    }

}


