
var ObjectUtilsForRenderingModule = (function () {

    /**
    * 
    * @param {Array} currentInputObject : Input Object that consisits of Super set of Properties
    * @param {Array} objectKeysForDisplay : Array of required keys for display ( Subset )
    * @param {Array} exclusionObjectKeys : Array of Keys to be excluded ( Subset )
    * 
    * @returns {Object} currentObject: Returns object with Required Subset of keys
    *
    */

    function buildObjectForDisplay(currentInputObject, objectKeysForDisplay, exclusionObjectKeys) {

        var currentObject = new Object();

        for (var currentKey of objectKeysForDisplay) {

            if (HelperUtilsModule.valueDefined(currentInputObject[currentKey]) &&
                ((exclusionObjectKeys)?!exclusionObjectKeys.includes(currentKey):true) ) {

                currentObject[currentKey] = currentInputObject[currentKey];
            }
        }

        return currentObject;
    }

    /**
    * 
    * @param {Array} inputObjectArray : Array of raw input objects
    * @param {Array} objectKeysForDisplay : Array of required keys for display
    * 
    * @returns {Array} objectListForDisplay: Returns array of objects with required values for display
    *
    */

    function buildObjectListForDisplay(inputObjectArray, objectKeysForDisplay) {

        var objectListForDisplay = new Array();

        for (var currentInputObject of inputObjectArray) {

            var currentObject = buildObjectForDisplay(currentInputObject, objectKeysForDisplay, null);
            objectListForDisplay.push(currentObject);
        }

        return objectListForDisplay;
    }

    /**
    * 
    * @param {JSON} jsonObjectResponse : JSON Object consisting of multi level <k,v> pairs
    * @param {Array} categoryNames : Array of category names ( expected to be in object response )
    * @param {Array} objectKeysForDisplay : Array of keys to be used while building display object array
    * 
    * @returns {Array} objectListForDisplay: Returns array of objects with required display values
    *
    */

    function buildCategoryLevelSummaryListForDisplay(jsonObjectResponse, categoryNames, objectKeysForDisplay) {

        var objectListForDisplay = new Array();

        if (GlobalWebClientModule.bDebug == true) {

            alert("buildCategoryLevelSummaryListForDisplay => jsonObject Length : " + Object.keys(jsonObjectResponse).length);
        }

        for (var currentKey of categoryNames) {

            if (HelperUtilsModule.valueDefined(jsonObjectResponse[currentKey])) {

                var currentObject = new Object();
                var currentCategoryJsonObject = JSON.parse(jsonObjectResponse[currentKey]);

                if (GlobalWebClientModule.bDebug == true) {

                    alert("buildCategoryLevelSummaryListForDisplay => current category : " + currentKey);
                    alert("buildCategoryLevelSummaryListForDisplay => current category object => num of keys : " +
                        Object.keys(currentCategoryJsonObject).length);
                }

                for (var currentOutputKey of objectKeysForDisplay) {

                    if (HelperUtilsModule.valueDefined(currentCategoryJsonObject[currentOutputKey])) {

                        currentObject[currentOutputKey] = currentCategoryJsonObject[currentOutputKey];
                    }

                    if (GlobalWebClientModule.bDebug == true) {

                        alert("buildCategoryLevelSummaryListForDisplay => currentCategoryJsonObject[currentOutputKey] : " +
                            currentCategoryJsonObject[currentOutputKey]);
                    }

                }

                objectListForDisplay.push(currentObject);
            }

        }

        return objectListForDisplay;
    }

    /**
    * 
    * @param {JSON} jsonObjectResponse : JSON Object consisting of multi level <k,v> pairs
    * @param {Array} inputCategoryNames : Array of category names ( expected to be in object response )
    * 
    * @returns {Array} categoryNames: Returns array of categoryNames present in Object Response
    *
    */

    function buildCategoryNamesForCurrentBudget(jsonObjectResponse, inputCategoryNames) {

        var categoryNames = new Array();

        for (var currentKey of inputCategoryNames) {

            if (HelperUtilsModule.valueDefined(jsonObjectResponse[currentKey])) {

                categoryNames.push(currentKey);
            }
        }

        return categoryNames;
    }

    /**
    * 
    * @param {JSON} jsonObjectResponse : JSON Object consisting of multi level <k,v> pairs
    * @param {Array} inputCategoryNames : Array of category names ( expected to be in object response )
    * @param {Array} inputCategoryDetailNames : Array of category Detail names corresponding to category names
    *
    * @returns {Array} categoryDetailNames: Returns array of category Detail Names present in Object Response
    *
    */

    function buildCategoryDetailsForCurrentBudget(jsonObjectResponse, inputCategoryNames, inputCategoryDetailNames) {

        var categoryDetailNames = new Array();
        var currentIndex = 0;

        for (var currentKey of inputCategoryNames) {

            if (HelperUtilsModule.valueDefined(jsonObjectResponse[currentKey])) {

                categoryDetailNames.push(inputCategoryDetailNames[currentIndex]);
            }

            currentIndex++;
        }

        return categoryDetailNames;
    }

    /**
    * 
    * @param {JSON} jsonObjectResponse : JSON Object consisting of multi level <k,v> pairs ( Response from Server )
    * @param {String} categoryName : Name of current Category for which details have to be Sub Categorized
    * @param {Array} subCategoryNames : Array of Sub Category Names to be present in Server Response
    * 
    * @returns {Array} objectListForDisplay: Returns array of objects with required display values for Sub Categories
    *
    */

    function buildSubCategoryLevelSummaryListForDisplay(jsonObjectResponse, categoryName, subCategoryNames) {

        var objectListForDisplay = new Array();
        var currentCategoryJsonObject = JSON.parse(jsonObjectResponse[categoryName]);

        for (var currentKey of subCategoryNames) {

            if (HelperUtilsModule.valueDefined(currentCategoryJsonObject[currentKey])) {

                var currentObject = new Object();
                currentObject.Expenditure = currentCategoryJsonObject[currentKey];
                objectListForDisplay.push(currentObject);
            }

        }

        return objectListForDisplay;
    }

    /**
    * 
    * @param {JSON} jsonObjectResponse : JSON Object consisting of multi level <k,v> pairs ( Server Response )
    * @param {String} categoryName : Name of current Category for which details have to be Sub Categorized
    * @param {Array} inputSubCategoryNames : Array of Sub Category Names ( to be present in Server Response )
    * @param {Array} inputSubCategoryDetailNames : Array of Sub Category Detail names to be extracted in Result
    *
    * @returns {Array} subCategoryDetailNames: Returns array of Sub Category Detail Names extracted based out of input
    *
    */

    function buildSubCategoryDetailsForCurrentBudget(jsonObjectResponse, categoryName, inputSubCategoryNames, inputSubCategoryDetailNames) {

        var subCategoryDetailNames = new Array();
        var currentIndex = 0;
        var currentCategoryJsonObject = JSON.parse(jsonObjectResponse[categoryName]);

        for (var currentKey of inputSubCategoryNames) {

            if (HelperUtilsModule.valueDefined(currentCategoryJsonObject[currentKey])) {

                if (inputSubCategoryDetailNames.length == 1) {

                    subCategoryDetailNames.push(inputSubCategoryDetailNames[0]);

                } else {

                    subCategoryDetailNames.push(inputSubCategoryDetailNames[currentIndex]);

                }

            }

            currentIndex++;
        }

        return subCategoryDetailNames;
    }

    /**
    * 
    * @param {JSON} jsonObjectResponse : JSON Object consisting of multi level <k,v> pairs Response from Server
    * @param {Array} categoryNames : Array of category names for which details have to be Sub Categorized
    * 
    * @returns {Array} objectListForDisplay: Returns array of objects with required display values for Sub Categories
    *
    */

    function getAllSubCategorySummaryGridObjectsForDisplay(jsonObjectResponse, categoryNames) {

        var objectListForDisplay = new Array();

        for (var currentCategoryName of categoryNames) {

            if (!HelperUtilsModule.valueDefined(jsonObjectResponse[currentCategoryName])) {

                continue;
            }

            var currentCategoryJsonObject = JSON.parse(jsonObjectResponse[currentCategoryName]);

            for (var currentKey of CategoryHelperUtilsModule.retrieveSubCategoriesForCategory(currentCategoryName)) {

                if (HelperUtilsModule.valueDefined(currentCategoryJsonObject[currentKey])) {

                    var currentObject = new Object();

                    currentObject.Expenditure = currentCategoryJsonObject[currentKey];
                    currentObject.SubCategoryName = currentKey;

                    objectListForDisplay.push(currentObject);
                }
            }
        }

        return objectListForDisplay;
    }

    /**
    * 
    * @param {Object} budgetRecordInQuestion : Budget Record Object in Question
    * 
    * @returns {Boolean} "True/False": Returns true if Budget Record, False otherwise
    *
    */

    function isResultBudgetRecordObject(budgetRecordInQuestion) {

        for (var currentReqKey of GlobalWebClientModule.budgetRecordKeys_ToCheckAuthenticity) {

            if (!HelperUtilsModule.valueDefined(budgetRecordInQuestion[currentReqKey])) {

                if (GlobalWebClientModule.bDebug == true) {

                    alert("ObjectUtilsForRenderingModule:isResultBudgetRecordObject => budgetRecordInQuestion : " + HelperUtilsModule.returnObjectString(
                        budgetRecordInQuestion));
                    alert("ObjectUtilsForRenderingModule:isResultBudgetRecordObject => Missin Key : " + currentReqKey);
                }

                return false;
            }
        }

        return true;
    }

    /**
    * 
    * @param {Array} budgetResultObjectArray : Array of Budget Records from which budget_id's need to be extracted
    * 
    * @returns {Array} budgetIdArray: Returns Budget Id Array extracted from Budget result object
    *
    */

    function extractBudgetIdsFromBudgetResultObjectArray(budgetResultObjectArray) {

        var budgetIdArray = new Array();

        for (var currentBudget = 1; currentBudget <= budgetResultObjectArray.length; currentBudget++) {

            if (ObjectUtilsForRenderingModule.isResultBudgetRecordObject(budgetResultObjectArray[currentBudget - 1])) {

                budgetIdArray.push(budgetResultObjectArray[currentBudget - 1].Budget_Id);
            }
        }

        return budgetIdArray;
    }

    /**
    * 
    * @param {Array} categoryNames : Array of Category Names for filling SubCategoryToImageMap
    * 
    * @returns {Map} subCategoryNamesToImageMap: Returns Map of Sub Category Names to Images for given Categories
    *
    */

    function buildSubCategoryToImageMapForGivenCategories(categoryNames) {

        var subCategoryNamesToImageMap = new Map();

        for (var currentCategoryName of categoryNames) {

            var currentSubCategoryNames = CategoryHelperUtilsModule.retrieveSubCategoriesForCategory(currentCategoryName);
            var currentSubCategoryImages = CategoryHelperUtilsModule.retrieveSubCategoryImagesForCategory(currentCategoryName);

            var currentIndex = 0;

            for (var currentSubCategoryName of currentSubCategoryNames) {

                subCategoryNamesToImageMap.set(currentSubCategoryName, currentSubCategoryImages[currentIndex++]);
            }

        }

        return subCategoryNamesToImageMap;
    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        buildObjectForDisplay: buildObjectForDisplay,
        buildObjectListForDisplay: buildObjectListForDisplay,

        buildCategoryLevelSummaryListForDisplay: buildCategoryLevelSummaryListForDisplay,
        buildCategoryNamesForCurrentBudget: buildCategoryNamesForCurrentBudget,
        buildCategoryDetailsForCurrentBudget: buildCategoryDetailsForCurrentBudget,

        buildSubCategoryLevelSummaryListForDisplay: buildSubCategoryLevelSummaryListForDisplay,
        buildSubCategoryDetailsForCurrentBudget: buildSubCategoryDetailsForCurrentBudget,

        isResultBudgetRecordObject: isResultBudgetRecordObject,
        extractBudgetIdsFromBudgetResultObjectArray: extractBudgetIdsFromBudgetResultObjectArray,

        getAllSubCategorySummaryGridObjectsForDisplay: getAllSubCategorySummaryGridObjectsForDisplay,
        buildSubCategoryToImageMapForGivenCategories: buildSubCategoryToImageMapForGivenCategories,
    };

})();
