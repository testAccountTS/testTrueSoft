({
    doInit : function(cmp, event, helper) {
        helper.getListProducts(cmp, event, helper);
    },

    keyCheck : function(cmp, event, helper) {
        if(event.which == 13) {
            helper.doSearch(cmp, cmp.get('v.searchKey'));
        } 
    },

    handleFilterEvent : function(cmp, event, helper) {
        let filterObj = event.getParam("filterObj");
        helper.filterEvent(cmp,filterObj);
    }    
})