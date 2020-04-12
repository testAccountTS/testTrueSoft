({
    doInit : function(cmp, event, helper) {
        helper.getFilterData(cmp, event, helper);
     },
 
     handleChange : function(cmp, event, helper) {
        let objFilter ={};
        if(cmp.get('v.objFilterOptions')){
            objFilter = cmp.get('v.objFilterOptions');
        }
        objFilter[event.getSource().get("v.label")] = event.getParam('value');
        cmp.set('v.objFilterOptions',objFilter);

        var appEvent = $A.get("e.c:OrderFilterEvent");
        appEvent.setParams({
            "filterObj" :  objFilter
        });
        appEvent.fire();            
    }       
})