({
    handleDetail : function(cmp, event, helper) {
        cmp.set('v.isOpenDetail', true);
    },

    handleCart : function(cmp, event, helper) {
        helper.onCart(cmp, event, helper);
    }
})