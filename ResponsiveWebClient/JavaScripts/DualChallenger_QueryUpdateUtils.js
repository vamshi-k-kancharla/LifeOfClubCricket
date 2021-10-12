
var DualChallenger_UpdateUtilsModule = (function () {

    /**
    * 
    * Takes care of DualChallenger Record Addition
    *
    */

    function addDualChallengerRecordFromUserInput(){

        var uniqueDualChallengerId = "DualChallengerId_" + HelperUtilsModule.returnUniqueIdBasedOnCurrentTime();

        var DualChallengerRecordDataMap = FormDataInputHelperUtilsModule.processFormInputData(uniqueDualChallengerId,
            GlobalWebClientModule.dualChallenger_RecordData_InputIds, GlobalWebClientModule.dualChallenger_RecordData_Keys );
        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);
        DualChallengerRecordDataMap.set("UserName", userNameValue);

        // Check for required input values

        if (HelperUtilsModule.valueDefined(DualChallengerRecordDataMap) && 
            FormDataInputHelperUtilsModule.checkForRequiredInputData(DualChallengerRecordDataMap,
            GlobalWebClientModule.dualChallenger_RecordData_RequiredKeys)) {

            if (GlobalWebClientModule.bDebug == true) {

                alert("All the Required Input Values are Present in Form data..Proceeding further");
            }

        } else {

            alert("One of the Required Input Values are missing from Form data...." +
            "Please enter required DualChallenger input data");
            alert("userNameValue => " + userNameValue);
            return;
        }

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("AddDualChallenger", DualChallengerRecordDataMap,
            postDualChallengerAddition_SuccessCallback, postDualChallengerAddition_FailureCallback, DualChallengerRecordDataMap);
    }

    /**
    * 
    * Post processing call backs after Web Client Requests
    *
    */

    function postDualChallengerAddition_SuccessCallback(webReqResponse, DualChallengerRecordDataMap) {

        alert("User input DualChallenger record addition successful : " + webReqResponse);
        window.localStorage.setItem(GlobalWebClientModule.currentDualChallenger_Id_Key, DualChallengerRecordDataMap.get("DualChallenger_Id"));

        if (GlobalWebClientModule.bDebug == true) {

            alert("DualChallenger_Id stored in Local Cache: " + window.localStorage.getItem(GlobalWebClientModule.currentDualChallenger_Id_Key));
        }

        document.location.replace("./AddDualChallenger.html");
    }

    function postDualChallengerAddition_FailureCallback(webReqResponse, DualChallengerRecordDataMap) {

        alert("User input DualChallenger record addition failed : " + webReqResponse);
        alert("DualChallenger_Id : " + DualChallengerRecordDataMap.get("DualChallenger_Id"));
        document.location.replace("./AddDualChallenger.html");
    }

    /**
    * 
    * Takes care of DualChallenger Details Query for Current User
    * 
    * @param {Function} postDualChallengerRecordsQuery_SuccessCallback  : Success Callback Function of DualChallenger Records Query
    * @param {Function} postDualChallengerRecordsQuery_FailureCallback  : Failure Callback Function of DualChallenger Records Query
    *
    */

    function retrieveAllDualChallengers(postDualChallengerRecordsQuery_SuccessCallback, postDualChallengerRecordsQuery_FailureCallback) {

        var DualChallengerRecordsQueryMap = new Map();

        // Web Client Request for Retrieving DualChallenger Records for Current User

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveDualChallengerDetails", DualChallengerRecordsQueryMap,
            postDualChallengerRecordsQuery_SuccessCallback, postDualChallengerRecordsQuery_FailureCallback);
    }

    /**
    * 
    * Takes care of DualChallenger Details Query for Current User
    * 
    * @param {Function} postDualChallengerRecordsQuery_SuccessCallback  : Success Callback Function of DualChallenger Records Query
    * @param {Function} postDualChallengerRecordsQuery_FailureCallback  : Failure Callback Function of DualChallenger Records Query
    *
    */

    /*

    function retrieveDualChallengerDetailsForCurrentUser(postDualChallengerRecordsQuery_SuccessCallback, postDualChallengerRecordsQuery_FailureCallback) {

        var DualChallengerRecordsQueryMap = new Map();

        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);

        DualChallengerRecordsQueryMap.set("UserName", userNameValue);

        // Web Client Request for Retrieving DualChallenger Records for Current User

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveDualChallengerDetails", DualChallengerRecordsQueryMap,
            postDualChallengerRecordsQuery_SuccessCallback, postDualChallengerRecordsQuery_FailureCallback);
    }

    */

    /**
    * 
    * Takes care of Retrieving DualChallenger names & Types from DualChallenger Record Objects
    * 
    * @param {JSON} jsonObject_DualChallengerRecords  : DualChallenger Records retrieved from Server Response
    * @param {Array} DualChallengerNames  : Names of DualChallenger Records retrieved from Server Response
    * @param {Array} DualChallengerTypes  : Types of DualChallenger Records retrieved from Server Response
    *
    */

    /*

    function retrieveDualChallengerNamesAndTypes(jsonObject_DualChallengerRecords, DualChallengerNames, DualChallengerTypes) {

        for (var currentObject of jsonObject_DualChallengerRecords) {

            DualChallengerNames.push(currentObject.DualChallengerName);

            if (currentObject.DualChallenger_Type == "Recurring") {

                DualChallengerTypes.push("monthly");

            } else {

                DualChallengerTypes.push(currentObject.DualChallenger_Type);
            }

        }

    }

    */


    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        addDualChallengerRecordFromUserInput: addDualChallengerRecordFromUserInput,
        retrieveAllDualChallengers: retrieveAllDualChallengers,

        /*
        retrieveDualChallengerDetailsForCurrentUser: retrieveDualChallengerDetailsForCurrentUser,
        retrieveDualChallengerNamesAndTypes: retrieveDualChallengerNamesAndTypes,
        */
       
    }

})();
