({
    doInit : function(cmp, event, helper) {
        helper.getAccount(cmp, event, helper);
        helper.chekUser(cmp, event, helper);
     },

    handleOrderButtonEvent : function(cmp, event, helper) {
        var idAccount = event.getParam("idAccount");
        helper.setIdAccount(cmp, event, helper);
    },
    
    handleCreateProduct : function(cmp, event, helper) {
        cmp.set('v.isOpenAddProducts', true);
        var addProductCmp = cmp.find("addProductCmp");
        var createProduct = addProductCmp.createProduct();        
    },

    handleOpenCart : function(cmp, event, helper) {
        cmp.set('v.isOpenCart', true);
    },
})