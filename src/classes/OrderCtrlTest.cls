@isTest
public with sharing class OrderCtrlTest {
    @testSetup static void setup() {
        Account a = new Account(Name = 'Company Internal');
        insert a;        
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User newUser = new User(Email = 'test@test.com',
                                Username = (UserInfo.getOrganizationId() + System.now().millisecond())+'test9@acme.com',
                                LastName = 'guest', 
                                Alias = 'guest', 
                                TimeZoneSidKey='GMT', 
                                LocaleSidKey = 'en_US', 
                                EmailEncodingKey = 'ISO-8859-1',
                                ProfileId = p.id, 
                                LanguageLocaleKey = 'en_US',
                                isManager__c = false); 
        insert  newUser;   
        
        List<ContentVersion> listDocums = new List<ContentVersion>();
        for(Integer i = 0; i < 50; i++){
            listDocums.add(new ContentVersion(
                Title = 'Test',
                PathOnClient = 'Test'+i+'.jpg',
                VersionData =EncodingUtil.base64Decode('Unit Test Attachment Body')
            ));
        }
       insert listDocums;        
        
       List<Product__c> listProducts = new List<Product__c>();
       for(Integer i = 0; i < 50; i++){
            listProducts.add(new Product__c(
               Name = 'Test' + i,
               Price__c = i,
               Family__c = 'Featured Electronics',
               Type__c = 'Laptops'
           ));
       }
      insert listProducts;         
    }

    @isTest
    static void getAccountTest(){
        Account acc = [SELECT Id FROM Account LIMIT 1];
        Account accRes = OrderCtrl.getAccount(acc.Id);
        System.assertEquals(accRes.Id, acc.Id);
    }

    @isTest
    static void checkUserIsManagerTest(){
        User userTest = [SELECT isManager__c 
                         FROM User
                         WHERE Email = 'test@test.com' AND LastName = 'guest'];
        System.runAs(userTest) {                         
            Boolean accRes = OrderCtrl.checkUserIsManager();
            System.assertEquals(false, accRes);
        }
    }
    
    @isTest
    static void getFilterDataTest(){
        Map<String, List<OrderCtrl.picklistWrapper>> mapRes = OrderCtrl.getFilterData();
        List<OrderCtrl.picklistWrapper> listPick = mapRes.get('Type');
        System.assert(listPick.size() > 0);
        
    }

    @isTest
    static void deleteDocumentTest(){
        ContentVersion conVer = [SELECT contentDocumentId FROM ContentVersion LIMIT 1];
        OrderCtrl.deleteDocument(conVer.contentDocumentId);
        List<ContentDocument> listDoc = [SELECT Id FROM ContentDocument];
        System.assert(listDoc.size() == 49);
    }
    
    @isTest
    static void getListProductTest(){
        List<Product__c> listItems = OrderCtrl.getListProduct();
        System.assertEquals(50, listItems.size());
    } 
    
    @isTest
    static void getContentVersionTest(){
        ContentDocument doc = [SELECT Id FROM ContentDocument LIMIT 1];
        String convId = OrderCtrl.getContentVersion(doc.Id);
        ContentVersion conVer = [SELECT contentDocumentId FROM ContentVersion WHERE Id = :convId];
        System.assertEquals(doc.Id, conVer.contentDocumentId);
    }
    
    @isTest
    static void searchProductsTest(){
        List<Product__c> listItems = OrderCtrl.searchProducts('test20');
        System.assertEquals(1, listItems.size());
    }
    
    @isTest
    static void createOrderTest(){
        Account acc = [SELECT Id FROM Account LIMIT 1];
        Product__c item = [SELECT Id FROM Product__c LIMIT 1];
        String strJSON = '[{"productId":"'+item.Id+'","quantity":1,"price":350}]';
        OrderCtrl.createOrder(strJSON, acc.Id);
        List<Order__c> listOrder = [SELECT Id FROM Order__c];
        System.assertEquals(1, listOrder.size());
    } 
 
}