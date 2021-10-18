
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
        DualChallengerRecordDataMap.set("ChallengeStatus", "Created");

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

        document.location.replace("./Challengers_Info.html");
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

        DualChallengerRecordsQueryMap.set("ChallengeStatus", "Created");

        // Web Client Request for Retrieving DualChallenger Records for Current User

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveDualChallengerDetails", DualChallengerRecordsQueryMap,
            postDualChallengerRecordsQuery_SuccessCallback, postDualChallengerRecordsQuery_FailureCallback);
    }


    /**
    * 
    * Takes care of DualChallenger Record Updation with Acceptor Details.
    *
    */

     function updateDualChallengerRecordFromUserInput(containerId){

        if (GlobalWebClientModule.bCurrentDebug2 == true) {

            alert("Accept Challenge......Update the Dual Challenger Record with Acceptor Details...Container Id = " + 
                containerId );
        }

        // ToDo : Write code for Order Checking If required. JSON Response may not be in Same Order.

        var currentContainer_DualChallengerId = document.getElementById(containerId + "_value1").innerHTML;

        if (GlobalWebClientModule.bCurrentDebug2 == true) {

            alert("Accept Challenge......Selected DualChallenger Id = " + currentContainer_DualChallengerId );
        }

        /****
        // Option 1 : Retrieve Challenger Records ( See if it's needed for update .. Loosen the Update requirements ),
                      And update the Record with Acceptor Details.      
        // Option 2 : Get Parameters as String, Use String Split to Update the Acceptor Details.
        *******/

        window.localStorage.setItem(GlobalWebClientModule.currentDualChallenger_TeamName_Key, "OfficersColony");

        var DualChallengerRecordDataMap = new Map();
        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);
        var teamNameValue = window.localStorage.getItem(GlobalWebClientModule.currentDualChallenger_TeamName_Key);

        if(!HelperUtilsModule.valueDefined(currentContainer_DualChallengerId)) {

            alert("Failed to obtain Accepted Container Dual Challenger Id ");
            return;
        }
        DualChallengerRecordDataMap.set("DualChallenger_Id", currentContainer_DualChallengerId);

        if(HelperUtilsModule.valueDefined(userNameValue)) {

            DualChallengerRecordDataMap.set("UserName", userNameValue);
        }

        if(HelperUtilsModule.valueDefined(teamNameValue)) {

            DualChallengerRecordDataMap.set("ChallengeStatus", "Accepted");
            DualChallengerRecordDataMap.set("AcceptorName", teamNameValue);
        }

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("UpdateDualChallenger", 
            DualChallengerRecordDataMap,
            postDualChallengerUpdation_SuccessCallback, 
            postDualChallengerUpdation_FailureCallback, 
            DualChallengerRecordDataMap);

    }


    /**
    * 
    * Post processing call backs after Web Client Requests : Update Dual Challenger Records
    *
    */

     function postDualChallengerUpdation_SuccessCallback(webReqResponse, DualChallengerRecordDataMap) {

        alert("User input DualChallenger record updation successful : " + webReqResponse);
        window.localStorage.setItem(GlobalWebClientModule.currentDualChallenger_Id_Key, DualChallengerRecordDataMap.get("DualChallenger_Id"));

        if (GlobalWebClientModule.bDebug == true) {

            alert("DualChallenger_Id stored in Local Cache: " + window.localStorage.getItem(GlobalWebClientModule.currentDualChallenger_Id_Key));
        }

        document.location.replace("./Matches_Info.html");

    }

    function postDualChallengerUpdation_FailureCallback(webReqResponse, DualChallengerRecordDataMap) {

        alert("User input DualChallenger record updation failed : " + webReqResponse);
        alert("DualChallenger_Id : " + DualChallengerRecordDataMap.get("DualChallenger_Id"));
        document.location.replace("./Challengers_Info.html");

    }


    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        addDualChallengerRecordFromUserInput : addDualChallengerRecordFromUserInput,
        retrieveAllDualChallengers : retrieveAllDualChallengers,
        updateDualChallengerRecordFromUserInput : updateDualChallengerRecordFromUserInput,

    }

})();
