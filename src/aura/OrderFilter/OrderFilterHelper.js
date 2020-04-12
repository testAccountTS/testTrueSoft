({
    getFilterData : function(cmp, event, helper){
        try {
            let action = cmp.get('c.getFilterData');
            action.setCallback(this, function(response){
                let state = response.getState();
                if(state === 'SUCCESS'){
                    let result = response.getReturnValue();
                    let arrayOfMapKeys = [];
                    for (var key in result) {
                        arrayOfMapKeys.push({key:key , value:result[key]});
                    }     
                    cmp.set('v.mapFilterOptions', arrayOfMapKeys);
                } else if (state === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
            $A.enqueueAction(action);   
        } catch (error) {
            console.log('Error getFilterData : ' + error);
        }        
    }
})