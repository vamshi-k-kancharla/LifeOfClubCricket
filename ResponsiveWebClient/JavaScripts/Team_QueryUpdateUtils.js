
var Team_UpdateUtilsModule = (function () {

    /**
    * 
    * Takes care of Team Record Addition
    *
    */

    function addTeamRecordFromUserInput(){

        var uniqueTeamId = "TeamId_" + HelperUtilsModule.returnUniqueIdBasedOnCurrentTime();

        var TeamRecordDataMap = FormDataInputHelperUtilsModule.processFormInputData(uniqueTeamId,
            GlobalWebClientModule.team_RecordData_InputIds, 
            GlobalWebClientModule.team_RecordData_Keys );
        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);
        TeamRecordDataMap.set("UserName", userNameValue);

        // Check for required input values

        if (HelperUtilsModule.valueDefined(TeamRecordDataMap) && 
            FormDataInputHelperUtilsModule.checkForRequiredInputData(TeamRecordDataMap,
            GlobalWebClientModule.team_RecordData_RequiredKeys)) {

        } else {

            alert("One of the Required Input Values are missing from Form data...." +
            "Please enter required Team input data");
            alert("userNameValue => " + userNameValue);
            return;
        }

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("AddTeam", TeamRecordDataMap,
            postTeamAddition_SuccessCallback, postTeamAddition_FailureCallback, TeamRecordDataMap);
    }

    /**
    * 
    * Post processing call backs after Web Client Requests
    *
    */

    function postTeamAddition_SuccessCallback(webReqResponse, TeamRecordDataMap) {

        alert("User input Team record addition successful : " + webReqResponse);
        window.localStorage.setItem(GlobalWebClientModule.currentTeam_Id_Key, TeamRecordDataMap.get("Team_Id"));

        if (GlobalWebClientModule.bDebug == true) {

            alert("Team_Id stored in Local Cache: " + window.localStorage.getItem(GlobalWebClientModule.currentTeam_Id_Key));
        }

        document.location.replace("./Challengers_Info.html");
    }

    function postTeamAddition_FailureCallback(webReqResponse, TeamRecordDataMap) {

        alert("User input Team record addition failed : " + webReqResponse);
        alert("Team_Id : " + TeamRecordDataMap.get("Team_Id"));
        document.location.replace("./AddTeam.html");
    }

    /**
    * 
    * Takes care of Team Details Query
    * 
    * @param {Function} postTeamRecordsQuery_SuccessCallback  : Success Callback Function of Team Records Query
    * @param {Function} postTeamRecordsQuery_FailureCallback  : Failure Callback Function of Team Records Query
    *
    */

    function retrieveAllTeams(postTeamRecordsQuery_SuccessCallback, postTeamRecordsQuery_FailureCallback) {

        var TeamRecordsQueryMap = new Map();

        //TeamRecordsQueryMap.set("ChallengeStatus", "Created");

        // Web Client Request for Retrieving Team Records

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveTeamDetails", TeamRecordsQueryMap,
            postTeamRecordsQuery_SuccessCallback, postTeamRecordsQuery_FailureCallback);
    }


    /**
    * 
    * Takes care of Retrieving Location Details
    * 
    * @param {Function} postTeamLocationsQuery_SuccessCallback  : Success Callback Function of Team Records Query
    * @param {Function} postTeamLocationsQuery_FailureCallback  : Failure Callback Function of Team Records Query
    *
    */

     function retrieveAndUpdateAllLocations(postTeamLocationsQuery_SuccessCallback, 
                postTeamLocationsQuery_FailureCallback) {

        var TeamRecordsQueryMap = new Map();

        // Web Client Request for Retrieving Team Records

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveTeamDetails", TeamRecordsQueryMap,
            postTeamLocationsQuery_SuccessCallback, postTeamLocationsQuery_FailureCallback);
    }


    /**
    * 
    * Takes care of Retrieving Team Details For a Specific Location
    * 
    * @param {Function} postTeamDetailsQuery_SuccessCallback  : Success Callback Function of Team Records Query
    * @param {Function} postTeamDetailsQuery_FailureCallback  : Failure Callback Function of Team Records Query
    *
    */

     function retrieveTeamsForASpecificLocation(postTeamDetailsQuery_SuccessCallback, 
        postTeamDetailsQuery_FailureCallback) {

        var TeamRecordsQueryMap = new Map();

        if (GlobalWebClientModule.bCurrentDebug2 == true) {

            alert("Selected Location = " + document.getElementById("TeamSearch_Place").value);
        }

        document.getElementById("teamSearchResultsContentWindow").innerHTML = null;
        TeamRecordsQueryMap.set("Team_Location", document.getElementById("TeamSearch_Place").value)

        // Web Client Request for Retrieving Team Records

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveTeamDetails", TeamRecordsQueryMap,
            postTeamDetailsQuery_SuccessCallback, postTeamDetailsQuery_FailureCallback);
    }


    /**
    * 
    * Takes care of Signup Request Record Updation with Signer Details.
    *
    */

    function updateTeamRecordFromUserInput(containerId){

        if (GlobalWebClientModule.bCurrentDebug2 == true) {

            alert("Signup For Team......Update the Team Signup Record with Signer Details...Container Id = " + 
                containerId );
        }

        // ToDo : Write code for Order Checking If required. JSON Response may not be in Same Order.

        var currentContainer_TeamId = document.getElementById(containerId + "_value1").innerHTML;

        if (GlobalWebClientModule.bCurrentDebug2 == true) {

            alert("Signup For Team......Selected Team Id = " + currentContainer_TeamId );
        }

        // Option 1 : Retrieve Team Details and Update the Player.      

        window.localStorage.setItem(GlobalWebClientModule.currentUserName_Key, "New_Signer_Name" + 
            HelperUtilsModule.returnUniqueIdBasedOnCurrentTime());

        var signerRecordDataMap = new Map();
        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);

        if(!HelperUtilsModule.valueDefined(currentContainer_TeamId)) {

            alert("Failed to obtain Signup Request Team Id ");
            return;
        }
        signerRecordDataMap.set("Team_Id", currentContainer_TeamId);
        signerRecordDataMap.set("SignupRequest_Id", "SignupRequestId_" + 
            HelperUtilsModule.returnUniqueIdBasedOnCurrentTime());

        if(HelperUtilsModule.valueDefined(userNameValue)) {

            signerRecordDataMap.set("Signer_Name", userNameValue);
            signerRecordDataMap.set("Current_Status", "Request_Submitted");
        }

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("SignupRequest", 
            signerRecordDataMap,
            postSignupRequest_SuccessCallback, 
            postSignupRequest_FailureCallback, 
            signerRecordDataMap);

    }


    /**
    * 
    * Post processing call backs after Web Client Requests : Signup Requests Submission
    *
    */

    function postSignupRequest_SuccessCallback(webReqResponse, signerRecordDataMap) {

        alert("Signup Request record updation successful : " + webReqResponse);
        document.location.replace("./Matches_Info.html");

    }

    function postSignupRequest_FailureCallback(webReqResponse, signerRecordDataMap) {

        alert("Signup Request record updation failed : " + webReqResponse);
        document.location.replace("./SearchAndSignup.html");

    }


    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        addTeamRecordFromUserInput : addTeamRecordFromUserInput,
        retrieveAllTeams : retrieveAllTeams,
        retrieveAndUpdateAllLocations : retrieveAndUpdateAllLocations,
        retrieveTeamsForASpecificLocation : retrieveTeamsForASpecificLocation,
        updateTeamRecordFromUserInput : updateTeamRecordFromUserInput,

    }

})();
