({
    getAccount : function(cmp, event, helper) {
        let action = cmp.get('c.getAccount');
        let recId = sessionStorage.getItem("recordId");
        cmp.set('v.idAccount', recId);
        console.log('recId=', recId);
        
        action.setParams({
            'recorId' : recId
        });

        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS'){
                let result = response.getReturnValue();
                console.log('result', JSON.stringify(result));
                
                if (result !== null){
                    console.log('result.Name = ', result.Name);
                    console.log('result.AccountNumber = ', result.AccountNumber);
                    
                    cmp.set('v.accountName', result.Name);
                    cmp.set('v.accountNumber', result.AccountNumber);
                }
            } else if (state === "ERROR") {
                console.log("Error: " + errorMessage);
            }

        });
        $A.enqueueAction(action);
    },
    
    chekUser : function (cmp, event, helper){
        let action = cmp.get('c.checkUserIsManager');
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS'){
                let result = response.getReturnValue();
                cmp.set('v.isManager', result);
            } else if (state === "ERROR") {
                console.log("Error: " + errorMessage);
            }
        });
        $A.enqueueAction(action);        
    }
})