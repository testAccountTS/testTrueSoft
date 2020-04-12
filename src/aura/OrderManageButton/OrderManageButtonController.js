({
    handleOrderManagment : function(cmp, event, helper) {
        let recordId = cmp.get('v.recordId'); 
        sessionStorage.setItem('recordId', recordId);
        window.open('https://truesofttest-dev-ed.lightning.force.com/lightning/n/Order_Management','');
    },
})