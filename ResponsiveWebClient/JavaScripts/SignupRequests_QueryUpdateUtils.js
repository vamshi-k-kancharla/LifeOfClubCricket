
var SignupRequests_UpdateUtilsModule = (function () {

    /**
    * 
    * Takes care of SignupRequest Details Query for Current User
    * 
    * @param {Function} postSignupRequestRecordsQuery_SuccessCallback  : Success Callback Function of SignupRequest Records Query
    * @param {Function} postSignupRequestRecordsQuery_FailureCallback  : Failure Callback Function of SignupRequest Records Query
    *
    */

    function retrieveAllSignupRequests(postSignupRequestRecordsQuery_SuccessCallback, 
        postSignupRequestRecordsQuery_FailureCallback) {

        var signupRequestRecordsQueryMap = new Map();

        signupRequestRecordsQueryMap.set("Current_Status", "Request_Submitted");

        // Web Client Request for Retrieving SignupRequest Records for Current User

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveSignupRequestDetails", 
            signupRequestRecordsQueryMap,
            postSignupRequestRecordsQuery_SuccessCallback, postSignupRequestRecordsQuery_FailureCallback);
    }




    /**
    * 
    * Takes care of SignupRequest Record Updation with Acceptor Details.
    *
    */

     function handleSignupRequestApprovals(containerId){

        if (GlobalWebClientModule.bCurrentDebug2 == true) {

            alert("Handle Signup Request Approvals......Update the Team Record with Signer Details & " +
            " take care of Status update for Signup Request...Container Id = " + 
                containerId );
        }

        // ToDo : Write code for Order Checking If required. JSON Response may not be in Same Order.

        var currentContainer_SignupRequestId = document.getElementById(containerId + "_value1").innerHTML;
        var currentContainer_TeamId = document.getElementById(containerId + "_value2").innerHTML;
        var currentContainer_SignerName = document.getElementById(containerId + "_value3").innerHTML;

        if (GlobalWebClientModule.bCurrentDebug2 == true) {

            alert("Approve Signup Request Id.....Selected SignupRequest Id = " + currentContainer_SignupRequestId );
        }

        //window.localStorage.setItem(GlobalWebClientModule.currentSignupRequest_TeamName_Key, "OfficersColony");

        var SignupRequestApprovalRecordDataMap = new Map();

        if(!HelperUtilsModule.valueDefined(currentContainer_SignupRequestId) || 
        !HelperUtilsModule.valueDefined(currentContainer_TeamId) ||
        !HelperUtilsModule.valueDefined(currentContainer_SignerName)) {

            alert("Failed to obtain required Values (SignupRequestId + TeamId + SignerName) for Signup Request Approval ");
            return;
        }
        SignupRequestApprovalRecordDataMap.set("SignupRequest_Id", currentContainer_SignupRequestId);
        SignupRequestApprovalRecordDataMap.set("Team_Id", currentContainer_TeamId);
        SignupRequestApprovalRecordDataMap.set("Signer_Name", currentContainer_SignerName);

        // Retrieve Team Record and Update with Signup Request Approval

        retrieveTeamRecordAndUpdateWithSignupRequestApproval(SignupRequestApprovalRecordDataMap);

    }


    /**
    * 
    * Takes care of Retrieving Team Details And Updating it with Signer Details
    * 
    * @param {Map} SignupRequestApprovalRecordDataMap  : Signup Request Details
    *
    */

     function retrieveTeamRecordAndUpdateWithSignupRequestApproval(SignupRequestApprovalRecordDataMap) {

        var TeamRecordsQueryMap = new Map();

        TeamRecordsQueryMap.set("Team_Id", SignupRequestApprovalRecordDataMap.get("Team_Id"))

        // Web Client Request for Retrieving Team Records

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveTeamDetails", TeamRecordsQueryMap,
            updateTeamRecordWithSignerDetails, postTeamDetailsQuery_FailureCallback, SignupRequestApprovalRecordDataMap);
    }


    /**
    * 
    * Post processing call backs after Web Client Requests : Retrieve Specific Team Record
    *
    */

     function updateTeamRecordWithSignerDetails(webReqResponse, SignupRequestApprovalRecordDataMap) {

        alert("Retrieval of Team Record successful : " + webReqResponse);

        var jsonResponseObjectStrings = webReqResponse.split("\n");
        var jsonObjectResponseArray = new Array();

        if (!HelperUtilsModule.valueDefined(webReqResponse) || jsonResponseObjectStrings.length != 1) {

            alert("More than one Team record Has gotten Retrieved for Team_Id : " + 
                SignupRequestApprovalRecordDataMap.get("SignupRequest_Id"));

            return;
        }

        for (var currentJSONObjectString of jsonResponseObjectStrings) {

            jsonObjectResponseArray.push(JSON.parse(currentJSONObjectString));
        }

        var currentTeamMembers = jsonObjectResponseArray[0].Team_Members;
        currentTeamMembers += ", " + SignupRequestApprovalRecordDataMap.get("Signer_Name");

        // Update Team Record

        var TeamRecordsQueryMap = new Map();

        TeamRecordsQueryMap.set("Team_Id", SignupRequestApprovalRecordDataMap.get("Team_Id"))
        TeamRecordsQueryMap.set("Team_Members", currentTeamMembers)

        // Web Client Request for Retrieving Team Records

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("UpdateTeam", TeamRecordsQueryMap,
            updateSignupRequestApprovalRecordStatus, postTeamRecordUpdate_FailureCallback, 
            SignupRequestApprovalRecordDataMap);
    }

    function postTeamDetailsQuery_FailureCallback(webReqResponse, SignupRequestApprovalRecordDataMap) {

        alert("Signup Request Approval Updation of DB failed : " + webReqResponse);
        alert("SignupRequest_Id : " + SignupRequestApprovalRecordDataMap.get("SignupRequest_Id"));
        document.getElementById("signupRequestsContentWindow").innerHTML = null;
        document.location.replace("./SignupRequests.html");

    }


    /**
    * 
    * Post processing call backs after Web Client Requests : Update Signup Request Record with Approval Status
    *
    */

     function updateSignupRequestApprovalRecordStatus(webReqResponse, SignupRequestApprovalRecordDataMap) {

        alert("Updating Signup Request Record with Approval Status : " + webReqResponse + 
            " , Signup Request Id = " + SignupRequestApprovalRecordDataMap.get("SignupRequest_Id"));

        // Update Team Record

        var signupRequestRecordMap = new Map();

        signupRequestRecordMap.set("SignupRequest_Id", SignupRequestApprovalRecordDataMap.get("SignupRequest_Id"))
        signupRequestRecordMap.set("Current_Status", "Request_Approved")

        // Web Client Request for Retrieving Team Records

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("UpdateSignupRequest", signupRequestRecordMap,
            postSignupRequestApproval_SuccessCallback, postSignupRequestApproval_FailureCallback, 
            SignupRequestApprovalRecordDataMap);
    }

    function postTeamRecordUpdate_FailureCallback(webReqResponse, SignupRequestApprovalRecordDataMap) {

        alert("Team Record Update With Signer Name failed : " + webReqResponse);
        alert("Signer Name : " + SignupRequestApprovalRecordDataMap.get("Signer_Name"));

        document.getElementById("signupRequestsContentWindow").innerHTML = null;
        document.location.replace("./SignupRequests.html");

    }


    /**
    * 
    * Post processing callbacks after Web Client Requests : Signup Request Record Approval Done
    *
    */

     function postSignupRequestApproval_SuccessCallback(webReqResponse, SignupRequestApprovalRecordDataMap) {

        alert("Signup Request Approval Done : " + webReqResponse);

        document.getElementById("signupRequestsContentWindow").innerHTML = null;
        document.location.replace("./SignupRequests.html");

    }

    function postSignupRequestApproval_FailureCallback(webReqResponse, SignupRequestApprovalRecordDataMap) {

        alert("Signup Request Approval Failed : " + webReqResponse);
        alert("Signer Name : " + SignupRequestApprovalRecordDataMap.get("Signer_Name"));

        document.getElementById("signupRequestsContentWindow").innerHTML = null;
        document.location.replace("./SignupRequests.html");

    }


    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        retrieveAllSignupRequests : retrieveAllSignupRequests,
        handleSignupRequestApprovals : handleSignupRequestApprovals,

    }


})();
