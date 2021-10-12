
var GlobalWebClientModule = (function () {

    // Globals & Configs

    var bDebug = false;
    var bCurrentDebugFlag = false;
    var bCurrentDebug2 = false;
    var webServerPrefix = "http://127.0.0.1:4500/?";
    var imageResourcePath = "./Resources/Pictures/";

    // Current User Context : Local cache

	var currentUserName_Key = "currentUserName";
	//var currentBudget_Id_Key = "currentBudget_Id";
	var currentExpense_Category_Key = "currentExpense_Category";
    var currentExpense_SubCategory_Key = "currentExpense_SubCategory";

	var currentDualChallenger_Id_Key = "currentDualChallenger_Id";


    // Budget Types

    //var budgetTypes = ["monthly", "yearly", "festiveseason", "occasional", "vacation", "unplanned"];
    var budgetType_ImageNames = ["BudgetType_Monthly.jpg", "BudgetType_Yearly.jpg", "BudgetType_FestiveSeason.jpg",
        "BudgetType_Occasional.jpg", "BudgetType_Vacation.jpg", "BudgetType_Unplanned.jpg"];
    var budgetDetailsPageName = ["./Categories.html"];
    var budgetRecordKeys_ForDisplay = ["Budget_Id", "BudgetName", "Place", "StartDate", "EndDate", "Amount"];
    var budgetRecordKeys_ToCheckAuthenticity = ["Budget_Id", "BudgetName"];

    var challengerTypes = ["dual", "pre-scheduled"];

    // All Category & SubCategory Names for <Key, Value> Pair Retrieval
	
    var categoryNames = ["food", "accommodation", "entertainment", "familycare", "medicalandfitness", "miscellaneous",
        "shopping", "transportation", "vacation"];
    var categoryContainer_ImageNames = ["food.jpg", "accommodation.jpg", "entertainment.jpg", "familycare.jpg", "gym.jpg",
        "miscellaneous.jpg", "shopping.jpg", "transportation.jpg", "vacation.jpg"];
    var categoryPageNames = ["./Food.html", "./Accommodation.html", "./Entertainment.html", "./FamilyCare.html",
        "./MedicalAndFitness.html", "./Miscellaneous.html", "./Shopping.html", "./Transportation.html",
        "./Vacation.html"];

    // Sub Categories & Corresponding Details

    var food_SubCategories = ["coffeeshop", "groceries", "restaurants"];
    var foodCategoryContainer_ImageNames = ["coffeeshop.jpg", "groceries.jpg", "restaurants.jpg"];
    var foodCategoryPageNames = ["./Expense_Info.html"];

    var accommodation_SubCategories = ["emi", "housekeeping", "hotel", "rent", "utilities"];
    var accommodationCategoryContainer_ImageNames = ["emi.jpg", "housekeeping.jpg", "hotel.jpg", "rent.jpg", "utilities.jpg"];
    var accommodationCategoryPageNames = ["./Expense_Info.html"];

    // Form Data Input Ids, Keys & Validation Reqs

    // User Registration Data

    var userRegistrationData_InputIds = ["UserType", "Name", "Location", "Email", "Address", "UserName", "Password", "Repeat-Password"];
    var userRegistrationData_Keys = ["User_Id", "UserType", "Name", "Location", "Email", "Address", "UserName", "Password", "Repeat-Password"];
    var userRegistrationData_RequiredKeys = ["User_Id", "UserType", "Name", "Email", "Address", "UserName", "Password"];

    // User Authentication Data

    var userAuthenticationData_InputIds = ["UserName", "Pwd"];
    var userAuthenticationData_Keys = ["UserName", "Password"];
    var userAuthenticationData_RequiredKeys = ["UserName", "Password"];

    // Budget Form Input Data

    /*
    var budgetFormInputData_InputLabels = ["BudgetName", "Budget Type", "Place", "StartDate", "EndDate", "Amount"];
    var budgetFormInputData_InputIds = ["BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount"];
    var budgetFormInputData_InputTypes = ["text", "select", "text", "date", "date", "text"];
    var budgetFormInputData_SelectInputInvokeFunctions = [null, null, null, null, null, null];
    var globalFormLayoutRatio = ["2", "8", "col-sm-1"];
    */

    // Dual Challenger Form Input Data

    var dualChallenger_FormInputData_InputLabels = ["Team Name", "Challenger Type", "Place", "Challenger Date", 
    "Ground Name", "Address", "Prize"];
    var dualChallenger_FormInputData_InputIds = ["Challenger_Name", "Challenger_Type", "Challenger_Place", 
    "Challenger_Date", "Challenger_Ground", "Challenger_Address", "Challenger_Prize"];
    var dualChallenger_FormInputData_InputTypes = ["text", "select", "text", "date", "text", "text", "text"];
    var dualChallenger_FormInputData_SelectInputInvokeFunctions = [null, null, null, null, null, null, null];
    var globalFormLayoutRatio = ["2", "8", "col-sm-1"];

    // Expense Form Input Data

    var expenseFormInputData_InputLabels = ["Expense Category", "Expense SubCategory", "ExpenseName", "Expense Type", "Place", "Date",
        "Amount", "Merchant Name"];
    var expenseFormInputData_InputIds = ["ExpenseCategory", "ExpenseSubCategory", "ExpenseName", "Expense_Type", "Place", "Date",
        "Amount", "MerchantName"];
    var expenseFormInputData_InputTypes = ["select", "select", "text", "select", "text", "date", "text", "text"];
    var expenseFormInputData_SelectInputInvokeFunctions = ["addExpenseSubCategorySelectionOptions()", null, null, null, null, null, null, null];


    // Budget Record Data

    /*
    var budgetRecordData_InputIds = ["BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount"];
    var budgetRecordData_Keys = ["Budget_Id", "BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount", "UserName"];
    var budgetRecordData_RequiredKeys = ["Budget_Id", "BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount", "UserName"];
    */

    // DualChallenger Record Data

    var dualChallenger_RecordData_InputIds = ["Challenger_Name", "Challenger_Type", "Challenger_Place", 
    "Challenger_Date", "Challenger_Ground", "Challenger_Address", "Challenger_Prize"];
    var dualChallenger_RecordData_Keys = ["DualChallenger_Id", "TeamName", "ChallengerType", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress", "ChallengerPrize", "UserName"];
    var dualChallenger_RecordData_RequiredKeys = ["DualChallenger_Id", "TeamName", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress"];

    var dualChallenger_RecordKeys_ForDisplay = ["TeamName", "ChallengerType", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress", "ChallengerPrize"];



    // Expense Record Data

    var expenseRecordData_InputIds = ["ExpenseCategory", "ExpenseSubCategory", "ExpenseName", "Expense_Type", "Place",
        "Date", "Amount", "MerchantName"];
    var expenseRecordData_Keys = ["Expense_Id", "Expense_Category", "Expense_SubCategory", "ExpenseName", "Expense_Type", "Place",
        "Date", "Amount", "MerchantName", "Budget_Id", "UserName"];
    var expenseRecordData_RequiredKeys = ["Expense_Id", "ExpenseName", "Expense_Type", "Place", "Date", "Amount",
        "MerchantName", "Budget_Id", "Expense_Category", "Expense_SubCategory", "UserName"];
    var expenseRecordKeys_ForDisplay = ["ExpenseName", "Expense_Type", "Place", "Date",
        "Amount", "MerchantName"];
    var expenseTypes = ["recurring", "festiveseason", "occasional", "vacation", "unplanned"];

    // dummy Result Object For <Key, Value> Pairs display

    var currentBudgetId_Dummy = "BudgetId_46013020198516384440";
    var dummyResultObject_SummaryDetails = { currentCategory: "dummy", noOfExpenses: "100", expenditure: "4500" };
    var dummyResultObject_ExpenseDetails = { merchantName: "Subway", place: "Hyderabad", expenditure: "200" };

    var requiredKeysForCategorySummary = ["Expenditure", "NumOfExpenses"];



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
		//currentBudget_Id_Key : currentBudget_Id_Key,
		currentExpense_Category_Key : currentExpense_Category_Key,
        currentExpense_SubCategory_Key: currentExpense_SubCategory_Key,

        // Budget Related Parameters

        //budgetTypes: budgetTypes,
        budgetType_ImageNames: budgetType_ImageNames,
        budgetDetailsPageName: budgetDetailsPageName,
        budgetRecordKeys_ForDisplay: budgetRecordKeys_ForDisplay,
        budgetRecordKeys_ToCheckAuthenticity: budgetRecordKeys_ToCheckAuthenticity,

        challengerTypes : challengerTypes,
        currentDualChallenger_Id_Key : currentDualChallenger_Id_Key,

        // Global data related to Categories & SubCategories

        categoryNames: categoryNames,
        categoryContainer_ImageNames: categoryContainer_ImageNames,
        categoryPageNames: categoryPageNames,

        food_SubCategories: food_SubCategories,
        foodCategoryContainer_ImageNames: foodCategoryContainer_ImageNames,
        foodCategoryPageNames: foodCategoryPageNames,

        accommodation_SubCategories: accommodation_SubCategories,
        accommodationCategoryContainer_ImageNames: accommodationCategoryContainer_ImageNames,
        accommodationCategoryPageNames: accommodationCategoryPageNames,

        // Global data related to Form Data Input Processing

        userRegistrationData_InputIds: userRegistrationData_InputIds,
        userRegistrationData_Keys: userRegistrationData_Keys,
        userRegistrationData_RequiredKeys: userRegistrationData_RequiredKeys,

        userAuthenticationData_InputIds: userAuthenticationData_InputIds,
        userAuthenticationData_Keys: userAuthenticationData_Keys,
        userAuthenticationData_RequiredKeys: userAuthenticationData_RequiredKeys,

        /*
        budgetRecordData_InputIds: budgetRecordData_InputIds,
        budgetRecordData_Keys: budgetRecordData_Keys,
        budgetRecordData_RequiredKeys: budgetRecordData_RequiredKeys,

        budgetFormInputData_InputLabels: budgetFormInputData_InputLabels,
        budgetFormInputData_InputIds: budgetFormInputData_InputIds,
        budgetFormInputData_InputTypes: budgetFormInputData_InputTypes,
        budgetFormInputData_SelectInputInvokeFunctions: budgetFormInputData_SelectInputInvokeFunctions,
        globalFormLayoutRatio: globalFormLayoutRatio,
        */

        dualChallenger_FormInputData_InputLabels : dualChallenger_FormInputData_InputLabels,
        dualChallenger_FormInputData_InputIds : dualChallenger_FormInputData_InputIds, 
        dualChallenger_FormInputData_InputTypes : dualChallenger_FormInputData_InputTypes,
        dualChallenger_FormInputData_SelectInputInvokeFunctions : dualChallenger_FormInputData_SelectInputInvokeFunctions,
        globalFormLayoutRatio : globalFormLayoutRatio,

        dualChallenger_RecordData_InputIds : dualChallenger_RecordData_InputIds,
        dualChallenger_RecordData_Keys : dualChallenger_RecordData_Keys,
        dualChallenger_RecordData_RequiredKeys : dualChallenger_RecordData_RequiredKeys,

        dualChallenger_RecordKeys_ForDisplay : dualChallenger_RecordKeys_ForDisplay,

    

        expenseFormInputData_InputLabels: expenseFormInputData_InputLabels,
        expenseFormInputData_InputIds: expenseFormInputData_InputIds,
        expenseFormInputData_InputTypes: expenseFormInputData_InputTypes,
        expenseFormInputData_SelectInputInvokeFunctions: expenseFormInputData_SelectInputInvokeFunctions,

        expenseRecordData_InputIds: expenseRecordData_InputIds,
        expenseRecordData_Keys: expenseRecordData_Keys,
        expenseRecordData_RequiredKeys: expenseRecordData_RequiredKeys,
        expenseRecordKeys_ForDisplay: expenseRecordKeys_ForDisplay,
        expenseTypes: expenseTypes,


        // Dummy Result Objects

        currentBudgetId_Dummy: currentBudgetId_Dummy,
        dummyResultObject_SummaryDetails: dummyResultObject_SummaryDetails,
        dummyResultObject_ExpenseDetails: dummyResultObject_ExpenseDetails,

        requiredKeysForCategorySummary: requiredKeysForCategorySummary,
	}

}) ();