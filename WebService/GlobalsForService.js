
'use strict';

/*************************************************************************
 * 
 * GlobalsForService : Module that handles Globals for Flow Control
 * 
**************************************************************************/

// Globals for retrieving the Seller bank

var periodicPollingInterval_DisjointDatabase = 5000;

// Define globals as per JSPDF Inclusion Usage/Syntax

var port = process.env.PORT || 4500;

// MongoDB Connection Variables

var mongoDbConnection = require('mongodb');
var mongoClient = mongoDbConnection.MongoClient;

// Single Database for all "LifeOfClubCricket" needs

var LifeOfClubCricket_Database_Name = "lifeOfClubCricket_DB";

// All Table/Collection Names

var userDetails_TableName = "lifeOfCricket_UserDetailsCollection";
var dualChallenger_Details_Table_Name = "dualChallenger_DetailsCollection";



// Mongo DB Database connections

var mongoLifeOfClubCricketDbUrl = 'mongodb://127.0.0.1:27017/' + LifeOfClubCricket_Database_Name;
var LifeOfClubCricketDbConnection;

var userRegistrationData_RequiredFields = ["UserType", "User_Id", "Name", "Email", "Location", "Address", "UserName", "Password"];
var userRegistrationData_UniqueFields = ["User_Id", "Email", "UserName"];

var dualChallenger_RecordRequiredFields = ["DualChallenger_Id", "TeamName", "ChallengerType", "ChallengerPlace", 
    "ChallengerDate", "ChallengerGround", "ChallengerAddress", "ChallengerPrize"];
var dualChallenger_RecordData_UniqueFields = ["DualChallenger_Id"];
var dualChallenger_RecordData_NameFileds = ["TeamName", "UserName"];
var dualChallenger_RecordData_SubGroupFileds = ["Budget_Type", "Place", "StartDate", "EndDate"];  // Not being Used Currently
var dualChallenger_RecordData_AtleastOneValueShouldBeDifferent = ["TeamName", "ChallengerType", 
"ChallengerPlace", "ChallengerDate", "ChallengerGround"];







/*********************************************************************************************************************/
/*********************************************************************************************************************/


// File Upload Request Globals

var expenseFilesUploadDirectory = "./FileUploadServer/LifeOfClubCricket-UploadedFiles/";

var budgetDetails_Table_Name = "budgetDetailsCollection";
var expenseDetails_Table_Name = "expenseDetailsCollection";
var budgetAnalytics_TableName = "budgetAnalyticsCollection";

// Budget & Expense Details : Required Fields

var budgetRecordRequiredFields = ["Budget_Id", "BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount", "UserName"];
var budgetRecordData_UniqueFields = ["Budget_Id"];
var budgetRecordData_NameFileds = ["BudgetName", "UserName"];
var budgetRecordData_SubGroupFileds = ["Budget_Type", "Place", "StartDate", "EndDate"];
var budgetRecordData_AtleastOneValueShouldBeDifferent = ["BudgetName", "UserName","Budget_Type", "Place", "StartDate", "EndDate"];

var expenseRecordRequiredFields = ["Expense_Id", "ExpenseName", "Expense_Type", "Place", "Expense_Category", "Expense_SubCategory", "Date",
    "Amount", "MerchantName", "Budget_Id", "UserName"];
var expenseRecordData_UniqueFields = ["UserName", " Budget_Id", "Expense_Id"];
var expenseRecordData_AtleastOneValueShouldBeDifferent = ["ExpenseName", "Expense_Type", "Place", "Expense_Category", "Expense_SubCategory",
    "Date", "Amount", "MerchantName", "Budget_Id", "UserName"];

var budgetLevelAnalyticsRecord_RequiredFields = ["AnalyticsRecord_Id", "Budget_Id", "UserName", "Expenditure", "NumOfExpenses", "NumOfPlaces",
    "NumOfMerchants", "NumOfCategories", "NumOfSubCategories", "Categories"];
var budgetLevelAnalyticsRecord_CategoryFields = ["food", "accommodation", "entertainment", "familycare", "medicalandfitness",
    "miscellaneous", "shopping", "transportation", "vacation"];

var budgetAnalyticsRecord_RequiredQueryFields = ["Budget_Id", "UserName"];

// Budget & Expense Input File Related Details : Required Fields

var expenseFileDataColumnKeys = ["Expense_Category", "Expense_SubCategory", "ExpenseName", "Expense_Type", "Place", "Date", "Amount",
    "MerchantName"];


/*********************************************************************************************************************/
/*********************************************************************************************************************/







// Global variables

var bDebug = true;


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Export the Globals
 * 
 **************************************************************************
 **************************************************************************
 */

exports.bDebug = bDebug;

exports.LifeOfClubCricketDbConnection = LifeOfClubCricketDbConnection;

exports.periodicPollingInterval_DisjointDatabase = periodicPollingInterval_DisjointDatabase;
exports.port = port;
exports.mongoDbConnection = mongoDbConnection;
exports.mongoClient = mongoClient;

exports.LifeOfClubCricket_Database_Name = LifeOfClubCricket_Database_Name;

exports.userDetails_TableName = userDetails_TableName;
exports.dualChallenger_Details_Table_Name = dualChallenger_Details_Table_Name;

exports.mongoLifeOfClubCricketDbUrl = mongoLifeOfClubCricketDbUrl;

exports.userRegistrationData_RequiredFields = userRegistrationData_RequiredFields;
exports.userRegistrationData_UniqueFields = userRegistrationData_UniqueFields;

exports.dualChallenger_RecordRequiredFields = dualChallenger_RecordRequiredFields;
exports.dualChallenger_RecordData_UniqueFields = dualChallenger_RecordData_UniqueFields;
exports.dualChallenger_RecordData_NameFileds = dualChallenger_RecordData_NameFileds;
exports.dualChallenger_RecordData_AtleastOneValueShouldBeDifferent = dualChallenger_RecordData_AtleastOneValueShouldBeDifferent; 







/*********************************************************************************************************************/
/*********************************************************************************************************************/


exports.budgetDetails_Table_Name = budgetDetails_Table_Name;
exports.expenseDetails_Table_Name = expenseDetails_Table_Name;
exports.budgetAnalytics_TableName = budgetAnalytics_TableName;

exports.expenseFilesUploadDirectory = expenseFilesUploadDirectory;

exports.budgetRecordRequiredFields = budgetRecordRequiredFields;

exports.expenseRecordRequiredFields = expenseRecordRequiredFields;
exports.expenseRecordData_UniqueFields = expenseRecordData_UniqueFields;
exports.expenseRecordData_AtleastOneValueShouldBeDifferent = expenseRecordData_AtleastOneValueShouldBeDifferent;

exports.budgetRecordData_UniqueFields = budgetRecordData_UniqueFields;
exports.budgetRecordData_NameFileds = budgetRecordData_NameFileds;
exports.budgetRecordData_SubGroupFileds = budgetRecordData_SubGroupFileds;
exports.budgetRecordData_AtleastOneValueShouldBeDifferent = budgetRecordData_AtleastOneValueShouldBeDifferent;

exports.budgetLevelAnalyticsRecord_CategoryFields = budgetLevelAnalyticsRecord_CategoryFields;
exports.budgetAnalyticsRecord_RequiredQueryFields = budgetAnalyticsRecord_RequiredQueryFields;
exports.budgetLevelAnalyticsRecord_RequiredFields = budgetLevelAnalyticsRecord_RequiredFields;

exports.expenseFileDataColumnKeys = expenseFileDataColumnKeys;


/*********************************************************************************************************************/
/*********************************************************************************************************************/

