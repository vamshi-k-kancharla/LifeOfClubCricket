
var GlobalWebClientModule = (function () {

    // Globals & Configs

    var bDebug = false;
    var bCurrentDebugFlag = false;
    var bCurrentDebug2 = true;
    var webServerPrefix = "http://127.0.0.1:4500/?";
    var imageResourcePath = "./Resources/Pictures/";

    // Current User Context : Local cache

	var currentUserName_Key = "currentUserName";
	var currentTeam_Id_Key = "current_TeamId";
	var currentDualChallenger_Id_Key = "currentDualChallenger_Id";
	var currentDualChallenger_TeamName_Key = "currentDualChallenger_TeamName";

    var challengerTypes = ["dual", "pre-scheduled"];

    // Form Data Input Ids, Keys & Validation Reqs

    // User Registration Data

    var userRegistrationData_InputIds = ["UserType", "Name", "Location", "Email", "Address", "UserName", "Password", "Repeat-Password"];
    var userRegistrationData_Keys = ["User_Id", "UserType", "Name", "Location", "Email", "Address", "UserName", "Password", "Repeat-Password"];
    var userRegistrationData_RequiredKeys = ["User_Id", "UserType", "Name", "Email", "Address", "UserName", "Password"];

    // User Authentication Data

    var userAuthenticationData_InputIds = ["UserName", "Pwd"];
    var userAuthenticationData_Keys = ["UserName", "Password"];
    var userAuthenticationData_RequiredKeys = ["UserName", "Password"];

    // Dual Challenger Form Input Data

    var dualChallenger_FormInputData_InputLabels = ["Team Name", "Challenger Type", "Place", "Challenger Date", 
    "Ground Name", "Address", "Prize"];
    var dualChallenger_FormInputData_InputIds = ["Challenger_Name", "Challenger_Type", "Challenger_Place", 
    "Challenger_Date", "Challenger_Ground", "Challenger_Address", "Challenger_Prize"];
    var dualChallenger_FormInputData_InputTypes = ["text", "select", "text", "date", "text", "text", "text"];
    var dualChallenger_FormInputData_SelectInputInvokeFunctions = [null, null, null, null, null, null, null];
    var globalFormLayoutRatio = ["2", "8", "col-sm-1"];

    // DualChallenger Record Data

    var dualChallenger_RecordData_InputIds = ["Challenger_Name", "Challenger_Type", "Challenger_Place", 
    "Challenger_Date", "Challenger_Ground", "Challenger_Address", "Challenger_Prize"];
    var dualChallenger_RecordData_Keys = ["DualChallenger_Id", "TeamName", "ChallengerType", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress", "ChallengerPrize", "UserName"];
    var dualChallenger_RecordData_RequiredKeys = ["DualChallenger_Id", "TeamName", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress", "ChallengeStatus"];

    var dualChallenger_RecordKeys_ForDisplay = ["DualChallenger_Id", "TeamName", "ChallengerType", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress", "ChallengerPrize"];

    var scheduledMatch_RecordKeys_ForDisplay = ["DualChallenger_Id", "TeamName", "ChallengerType", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress", "ChallengerPrize", "AcceptorName", "ChallengeStatus"];


    // Team Form Input Data

    // ToDo : Improvise on Team members Addition

    var team_FormInputData_InputLabels = ["Team Name", "Team Location","Team Members (, Separated)", "Created Date", 
    "Home Ground", "Home Ground Address", "Team Coach", "Team Manager", "Team Sponsorer"];
    var team_FormInputData_InputIds = ["Team_Name", "Team_Location", "Team_Members", "Team_Creation_Date", 
    "Team_Home_Ground", "Team_Ground_Address", "Team_Coach", "Team_Manager", "Team_Sponsorer"];
    var team_FormInputData_InputTypes = ["text", "text", "text", "date", "text", "text", "text", "text", "text"];
    var team_FormInputData_SelectInputInvokeFunctions = [null, null, null, null, null, null, null, null, null];

    // Team Record Data

    var team_RecordData_InputIds = team_FormInputData_InputIds;
    var team_RecordData_Keys = ["Team_Id", "TeamName", "Team_Location", "Team_Members", "Team_Creation_Date", 
    "Team_Home_Ground", "Team_Ground_Address", "Team_Coach", "Team_Manager", "Team_Sponsorer"];
    var team_RecordData_RequiredKeys = ["Team_Id", "TeamName", "Team_Location", "Team_Members", "Team_Creation_Date", 
    "Team_Home_Ground"];

    var team_RecordKeys_ForDisplay = ["Team_Id", "TeamName", "Team_Location", "Team_Creation_Date", 
    "Team_Home_Ground", "Team_Ground_Address", "Team_Coach", "Team_Manager", "Team_Sponsorer"];


    // Expose local variables for global access

    return {

        // Globals & Configs

        bDebug: bDebug,
        bCurrentDebugFlag: bCurrentDebugFlag,
        bCurrentDebug2: bCurrentDebug2,
        webServerPrefix: webServerPrefix,
        imageResourcePath: imageResourcePath,

        // Current User Context : Local cache

		currentUserName_Key : currentUserName_Key,
        currentTeam_Id_Key : currentTeam_Id_Key,

        challengerTypes : challengerTypes,
        currentDualChallenger_Id_Key : currentDualChallenger_Id_Key,
        currentDualChallenger_TeamName_Key : currentDualChallenger_TeamName_Key,

        // Global data related to Form Data Input Processing

        userRegistrationData_InputIds: userRegistrationData_InputIds,
        userRegistrationData_Keys: userRegistrationData_Keys,
        userRegistrationData_RequiredKeys: userRegistrationData_RequiredKeys,

        userAuthenticationData_InputIds: userAuthenticationData_InputIds,
        userAuthenticationData_Keys: userAuthenticationData_Keys,
        userAuthenticationData_RequiredKeys: userAuthenticationData_RequiredKeys,

        dualChallenger_FormInputData_InputLabels : dualChallenger_FormInputData_InputLabels,
        dualChallenger_FormInputData_InputIds : dualChallenger_FormInputData_InputIds, 
        dualChallenger_FormInputData_InputTypes : dualChallenger_FormInputData_InputTypes,
        dualChallenger_FormInputData_SelectInputInvokeFunctions : dualChallenger_FormInputData_SelectInputInvokeFunctions,
        globalFormLayoutRatio : globalFormLayoutRatio,

        dualChallenger_RecordData_InputIds : dualChallenger_RecordData_InputIds,
        dualChallenger_RecordData_Keys : dualChallenger_RecordData_Keys,
        dualChallenger_RecordData_RequiredKeys : dualChallenger_RecordData_RequiredKeys,

        dualChallenger_RecordKeys_ForDisplay : dualChallenger_RecordKeys_ForDisplay,
        scheduledMatch_RecordKeys_ForDisplay : scheduledMatch_RecordKeys_ForDisplay,

        team_FormInputData_InputLabels : team_FormInputData_InputLabels,
        team_FormInputData_InputIds : team_FormInputData_InputIds,
        team_FormInputData_InputTypes : team_FormInputData_InputTypes,
        team_FormInputData_SelectInputInvokeFunctions : team_FormInputData_SelectInputInvokeFunctions,
    
        team_RecordData_InputIds : team_RecordData_InputIds,
        team_RecordData_Keys : team_RecordData_Keys,
        team_RecordData_RequiredKeys : team_RecordData_RequiredKeys,
        team_RecordKeys_ForDisplay : team_RecordKeys_ForDisplay,
    
    }

}) ();