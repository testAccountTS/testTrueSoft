@isTest
public with sharing class OrderTriggerTest {
    @testSetup static void setup() {
        Account a = new Account(Name = 'Company Internal');
        insert a;  
        
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
    static void TriggerTest(){
        Account acc = [SELECT Id FROM Account LIMIT 1];
        Order__c order = new Order__c( AccountId__c = acc.Id);
        insert order;
        List<Product__c> listItems = [SELECT Id, Price__c FROM Product__c]; 
        List<OrderItem__c> items = new List<OrderItem__c>();
        Decimal sumPrice = 0;
        Integer sumQuantity = 0;
        for(Product__c item : listItems){
            items.add(new OrderItem__c(
                OrderId__c = order.Id,
                ProductId__c = item.Id,
                Quantity__c = 1,
                Price__c = item.Price__c
            ));
            sumPrice += item.Price__c;
            sumQuantity += 1; 
        }                        
        insert items;
        order = [SELECT TotalPrice__c, TotalProductCount__c FROM Order__c];
        System.assertEquals(order.TotalPrice__c, sumPrice);
        System.assertEquals(order.TotalProductCount__c, sumQuantity);
    }    
}