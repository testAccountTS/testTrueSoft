public with sharing class OrderCtrl {
    
    @AuraEnabled
    public static Account getAccount(String recorId){
        if(!String.isBlank(recorId)){
            Account acc = [SELECT Name, AccountNumber 
                           FROM Account
                           WHERE Id = :recorId
                           LIMIT 10000];
            return acc;                            
        } else {
            return null;
        }
    }

    @AuraEnabled
    public static Boolean checkUserIsManager(){
        User u = [SELECT Id, IsManager__c, Firstname 
                  FROM User 
                  WHERE id = :userinfo.getuserid()];
        return u.IsManager__c;                  
    }

    @AuraEnabled
    public static Map<String, List<picklistWrapper>> getFilterData(){
        Map<String,String> mapField = new Map<String,String>();
        mapField.put('Type','Type__c');
        mapField.put('Family','Family__c');
        Map<String, List<picklistWrapper>> mapPicklist = new Map<String, List<picklistWrapper>>();
        for(String key : mapField.keySet()){
            List<picklistWrapper> listType = findPicklistOptions('Product__c', mapField.get(key));
            mapPicklist.put(key,listType);
        }
        return mapPicklist;
    }

    @AuraEnabled
    public static List<picklistWrapper> findPicklistOptions(String objAPIName, String fieldAPIname) {
        System.debug(objAPIName + ' --- '+fieldAPIname);
        List<picklistWrapper> returnValue = new list<picklistWrapper>();
		Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
		Schema.sObjectType objType = schemaMap.get(objAPIName);
		Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
		Map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
		list <Schema.PicklistEntry> values = fieldMap.get(fieldAPIname).getDescribe().getPickListValues();
		for (Schema.PicklistEntry a: values) {
			picklistWrapper picklist = new picklistWrapper();
			picklist.label = a.getLabel();
			picklist.value = a.getValue();
			returnValue.add(picklist);            
		}
        return returnValue;
    }   
    
    @AuraEnabled
    public static void deleteDocument(String idDocument){
        System.debug('idDocument = ' + idDocument);
        if(!String.isBlank(idDocument)){
            ContentDocument[] doc = [SELECT Id 
                                    FROM ContentDocument 
                                    WHERE Id = :idDocument];
            if (doc.size() > 0){
                delete doc;
            }                        
        }
    }

    @AuraEnabled
    public static  List<Product__c> getListProduct(){
        List<Product__c> listProduct = [SELECT Id, Name, Price__c, Family__c,Image__c, Type__c, Description__c
                                        FROM Product__c
                                        LIMIT 10000];
        return listProduct;
    }

    @AuraEnabled
    public static String getContentVersion(String documentId){
        ContentVersion conV = [SELECT Id
                               FROM ContentVersion 
                               WHERE ContentDocumentId  = :documentId];
        return conV.Id;
    } 
    
    @AuraEnabled
    public static List<Product__c> searchProducts(String searchKey){
        String query = 'SELECT Id, Name, Price__c, Family__c,Image__c, Type__c, Description__c'+
                        ' FROM Product__c ';
        if(!String.isBlank(searchKey)){
            query+= ' WHERE Name like \'%'+searchKey+'%\'';
        }
               
        List<Product__c> listProducts = Database.query(query);               
        return listProducts;
    } 
    
    @AuraEnabled
    public static void createOrder(String listProductsJSON, String idAccount){
        if(!String.isBlank(listProductsJSON)&&(!String.isBlank(idAccount))){
            Order__c order = new Order__c( AccountId__c = idAccount);
            insert order;

            List<OrderItem__c> items = new List<OrderItem__c>();
            List<WrapperItemProduct> listItems = (List<WrapperItemProduct>) JSON.deserialize(listProductsJSON, List<WrapperItemProduct>.class);
            for(WrapperItemProduct product : listItems){
                items.add(new OrderItem__c(
                    OrderId__c = order.Id,
                    ProductId__c = product.productId,
                    Quantity__c = product.quantity,
                    Price__c = product.price
                ));
            }
            insert items;
        }
    }

    public class WrapperItemProduct{
        public String productId;
        public Integer quantity;
        public Decimal price;
    }

    public class picklistWrapper{
        @AuraEnabled 
		public string label;
        @AuraEnabled 
		public string value;
    }

}