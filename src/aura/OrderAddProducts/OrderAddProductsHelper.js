({
    deleteDocument : function(cmp, idDocument) {
        let action = cmp.get('c.deleteDocument');
        action.setParams({
            'idDocument' : idDocument
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS'){
                console.log('Delete success');
            } else if (state === "ERROR") {
                console.log("Error: " + errorMessage);
            }
        });
        $A.enqueueAction(action);
    },

    onSave : function(cmp, event, helper){
        try {
            let isValidName =  cmp.find('field').reduce(function (validSoFar, inputCmp) {
                inputCmp.showHelpMessageIfInvalid();
                return validSoFar && inputCmp.get('v.validity').valid;
            }, true);             
            
            if(isValidName) {
                cmp.find("productRecordCreator").saveRecord(function(saveResult) {
                    if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                        var resultsToast = $A.get("e.force:showToast");
                        resultsToast.setParams({
                            "title": "Saved",
                            "message": "The record was saved."
                        });
                        resultsToast.fire();
                        cmp.set('v.isOpen',false);
                    } else if (saveResult.state === "INCOMPLETE") {
                        console.log("User is offline, device doesn't support drafts.");
                    } else if (saveResult.state === "ERROR") {
                        console.log('Problem saving contact, error: ' + JSON.stringify(saveResult.error));
                    } else {
                        console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
                    }
                });
            }            
        } catch (error) {
            console.log('Error onSave : ' + error);
        }

    },

    setPickListValue : function(cmp, event, helper){
        try {
            function setTypeVlue(listTypeR) {
                cmp.set('v.optionsType', listTypeR); 
            }
            function setFamilyVlue(listTypeR) {
                cmp.set('v.optionsFamily', listTypeR); 
            }            
            helper.getPickListValue(cmp, 'Product__c', 'Type__c',  setTypeVlue);
            helper.getPickListValue(cmp, 'Product__c', 'Family__c',setFamilyVlue);
                
        } catch (error) {
           console.log('Error setPickListValue : ' + error);
            
        }
    },
    
    getPickListValue : function(cmp, objName, fieldName, getPickListVlue){
        try {
            let action = cmp.get('c.findPicklistOptions');
            action.setParams({
                'objAPIName'   : objName,
                'fieldAPIname' : fieldName
            });
            action.setCallback(this, function(response){
                let state = response.getState();
                if(state === 'SUCCESS'){
                    let result = response.getReturnValue();
                    getPickListVlue(result);
                } else if (state === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
            $A.enqueueAction(action);        
        } catch (error) {
           console.log('Error getPickListValue: ' + error);
        }    
    },

    createNewProduct : function(cmp, event, helper){
        cmp.find("productRecordCreator").getNewRecord(
            "Product__c", 
            null,      
            false,     
            $A.getCallback(function() {
                var rec = cmp.get("v.newProduct");
                var error = cmp.get("v.newProductError");
                if(error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                    return;
                }
                console.log("Record template initialized: " + rec.apiName);
            })
        );        
    },
    
    getIdContentVersion : function(cmp, documentId){
        try {
            let action = cmp.get('c.getContentVersion');
            action.setParams({
                'documentId'   : documentId,
            });
            action.setCallback(this, function(response){
                let state = response.getState();
                if(state === 'SUCCESS'){
                    let result = response.getReturnValue();
                    cmp.set('v.simpleNewProduct.Image__c', result);
                } else if (state === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
            $A.enqueueAction(action);        
        } catch (error) {
           console.log('Error getPickListValue: ' + error);
        }
    }

})