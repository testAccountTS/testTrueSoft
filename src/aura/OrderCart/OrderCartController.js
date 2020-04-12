({
    doInit : function(cmp, event, helper){
        helper.setTabeColumns(cmp);
    },
    closeModal : function(cmp, event, helper) {
        cmp.set('v.isOpen', false);
    },

    handleCartEvent : function(cmp, event, helper) {
        let listProducts = event.getParam("listProducts");
        helper.createListProducts(cmp,helper, listProducts);
    },

    handleRowAction : function(cmp, event, helper) {
        let action = event.getParam('action');
        let row = event.getParam('row');
        switch (action.name) {
            case 'delete':
                {
                    helper.removeProduct(cmp, event, row);
                    break;
                }
        }           
    },

    handleSaveEdition : function(cmp, event, helper) {
        const draftValues = event.getParam('draftValues');
        helper.onSave(cmp, helper, draftValues);
    },

    handleCheckout : function(cmp, event, helper) {
        helper.onCheckout(cmp, event, helper);
    }
})