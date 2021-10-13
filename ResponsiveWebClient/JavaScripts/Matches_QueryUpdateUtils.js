
var ScheduledMatch_UpdateUtilsModule = (function () {

    /**
    * 
    * Takes care of ScheduledMatch Details Query for Current User
    * 
    * @param {Function} postScheduledMatchRecordsQuery_SuccessCallback  : Success Callback Function of ScheduledMatch Records Query
    * @param {Function} postScheduledMatchRecordsQuery_FailureCallback  : Failure Callback Function of ScheduledMatch Records Query
    *
    */

    function retrieveAllScheduledMatches(postScheduledMatchRecordsQuery_SuccessCallback, postScheduledMatchRecordsQuery_FailureCallback) {

        var ScheduledMatchRecordsQueryMap = new Map();

        ScheduledMatchRecordsQueryMap.set("ChallengeStatus", "Accepted");

        // Web Client Request for Retrieving ScheduledMatch Records for Current User

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveDualChallengerDetails", ScheduledMatchRecordsQueryMap,
            postScheduledMatchRecordsQuery_SuccessCallback, postScheduledMatchRecordsQuery_FailureCallback);
    }

    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        retrieveAllScheduledMatches : retrieveAllScheduledMatches,

    }

})();
