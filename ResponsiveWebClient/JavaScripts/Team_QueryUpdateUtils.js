
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
    * Takes care of Team Record Updation with Acceptor Details.
    *
    */

    /*

    function updateTeamRecordFromUserInput(containerId){

        if (GlobalWebClientModule.bCurrentDebug2 == true) {

            alert("Accept Challenge......Update the Dual Challenger Record with Acceptor Details...Container Id = " + 
                containerId );
        }

        // ToDo : Write code for Order Checking If required. JSON Response may not be in Same Order.

        var currentContainer_TeamId = document.getElementById(containerId + "_value1").innerHTML;

        if (GlobalWebClientModule.bCurrentDebug2 == true) {

            alert("Accept Challenge......Selected Team Id = " + currentContainer_TeamId );
        }

        // Option 1 : Retrieve Team Details and Update the Player.      

        window.localStorage.setItem(GlobalWebClientModule.currentTeam_TeamName_Key, "OfficersColony");

        var TeamRecordDataMap = new Map();
        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);
        var teamNameValue = window.localStorage.getItem(GlobalWebClientModule.currentTeam_TeamName_Key);

        if(!HelperUtilsModule.valueDefined(currentContainer_TeamId)) {

            alert("Failed to obtain Accepted Container Dual Challenger Id ");
            return;
        }
        TeamRecordDataMap.set("Team_Id", currentContainer_TeamId);

        if(HelperUtilsModule.valueDefined(userNameValue)) {

            TeamRecordDataMap.set("UserName", userNameValue);
        }

        if(HelperUtilsModule.valueDefined(teamNameValue)) {

            TeamRecordDataMap.set("ChallengeStatus", "Accepted");
            TeamRecordDataMap.set("AcceptorName", teamNameValue);
        }

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("UpdateTeam", 
            TeamRecordDataMap,
            postTeamUpdation_SuccessCallback, 
            postTeamUpdation_FailureCallback, 
            TeamRecordDataMap);

    }


    /**
    * 
    * Post processing call backs after Web Client Requests : Update Dual Challenger Records
    *
    */

    /*

    function postTeamUpdation_SuccessCallback(webReqResponse, TeamRecordDataMap) {

        alert("User input Team record updation successful : " + webReqResponse);
        window.localStorage.setItem(GlobalWebClientModule.currentTeam_Id_Key, TeamRecordDataMap.get("Team_Id"));

        if (GlobalWebClientModule.bDebug == true) {

            alert("Team_Id stored in Local Cache: " + window.localStorage.getItem(GlobalWebClientModule.currentTeam_Id_Key));
        }

        document.location.replace("./Matches_Info.html");

    }

    function postTeamUpdation_FailureCallback(webReqResponse, TeamRecordDataMap) {

        alert("User input Team record updation failed : " + webReqResponse);
        alert("Team_Id : " + TeamRecordDataMap.get("Team_Id"));
        document.location.replace("./Challengers_Info.html");

    }

    */


    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        addTeamRecordFromUserInput : addTeamRecordFromUserInput,
        retrieveAllTeams : retrieveAllTeams,
        //updateTeamRecordFromUserInput : updateTeamRecordFromUserInput,

    }

})();
