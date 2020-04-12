({
    getListProducts : function(cmp, event, helper) {
        let action = cmp.get('c.getListProduct');
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS'){
                let result = response.getReturnValue();
                cmp.set('v.listProducts', result); 
                cmp.set('v.listProductsAll', result);                
            } else if (state === "ERROR") {
                console.log("Error: " + errorMessage);
            }
        });
        $A.enqueueAction(action);         
    },

    doSearch : function(cmp, searchKey){
        try {
            let action = cmp.get('c.searchProducts');
            action.setParams({
                'searchKey' : searchKey
            });
            action.setCallback(this, function(response){
                let state = response.getState();
                if(state === 'SUCCESS'){
                    let result = response.getReturnValue();
                    cmp.set('v.listProducts', result);
                    cmp.set('v.listProductsAll', result);                 
                } else if (state === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
            $A.enqueueAction(action);    
        } catch (error) {
            console.log('Error doSearch : ' + error);
                
        }        
    },

    filterEvent : function (cmp,filterObj) {
        try {
            if(filterObj.Type !== undefined && filterObj.Type.length > 0|| 
                filterObj.Family !== undefined && filterObj.Family.length > 0){
                let listProducts = cmp.get('v.listProductsAll');
                let listFilterProduct = Object.values(listProducts).filter(function(product){
                    //check "Type" value
                    if(filterObj.hasOwnProperty('Type')&&(filterObj['Type'].includes(product.Type__c))){
                        return true;
                    } else 
                    //check "Family" value
                    if(filterObj.hasOwnProperty('Family')&&(filterObj['Family'].includes(product.Family__c))){
                        return true;
                    } else return false;
                });
                cmp.set('v.listProducts', listFilterProduct);
            } else {
                cmp.set('v.listProducts', cmp.get('v.listProductsAll'));
            }
        } catch (error) {
           console.log('Error handleFilterEvent : ' + error);
        }       
    }
})