({
    doInit : function(cmp, event, helper) {
        helper.setPickListValue(cmp, event, helper);
        helper.createNewProduct(cmp, event, helper);
    },

    handlerCreateNewProduct : function(cmp, event, helper){
        helper.createNewProduct(cmp, event, helper);
    },
    
    closeModal : function(cmp, event, helper) {
        helper.deleteDocument(cmp, cmp.get('v.fileId'));
        cmp.set('v.isOpen', false);
    },
    
    UploadFinished : function(cmp, event, helper) {
        let idDocument = cmp.get('v.fileId');
        helper.deleteDocument(cmp, idDocument);
        var uploadedFiles = event.getParam("files");
        cmp.set('v.fileName', uploadedFiles[0].name);
        cmp.set('v.fileId', uploadedFiles[0].documentId);
        helper.getIdContentVersion(cmp, uploadedFiles[0].documentId);
    },
    
    handleSave : function(cmp, event, helper) {
        cmp.set('v.simpleNewProduct.Type__c', cmp.find("typeId").get("v.value"));
        cmp.set('v.simpleNewProduct.Family__c', cmp.find("familyId").get("v.value"));
        helper.onSave(cmp, event, helper);
    }
})