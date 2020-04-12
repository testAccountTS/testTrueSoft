public with sharing class OrderTotalTriggerHandler {
    
    public static void onAfterInsert(List<OrderItem__c> listItems) {
        System.debug(listItems);
        Set<Id> seIdOrder = new Set<Id>();
        for(OrderItem__c item : listItems){
            seIdOrder.add(item.OrderId__c);
        }
        Map<String,Map<String,Decimal>> mapOrders = new Map<String,Map<String,Decimal>>();
        
        for(Id orderId : seIdOrder){
            Decimal totalQuantity = 0;
            Decimal totalPrice = 0;
            Map<String, Decimal> mapTotal = new Map<String, Decimal>();
            for(OrderItem__c item : listItems){
                if(orderId == item.OrderId__c){
                    totalQuantity += item.Quantity__c;
                    totalPrice += item.Price__c;
                }
            }
            mapTotal.put('totalQuantity',totalQuantity);
            mapTotal.put('totalPrice',totalPrice);
            mapOrders.put(orderId, mapTotal);
        }
        List<Order__c> lisOrders = [SELECT Id, TotalProductCount__c, TotalPrice__c 
                                    FROM Order__c
                                    WHERE Id IN :seIdOrder];
        System.debug('lisOrders ' + lisOrders);
        List<Order__c> newListOrders = new List<Order__c>();

        for(Order__c order : lisOrders){
            Map<String, Decimal> mapOrderItem = mapOrders.get(order.Id);
            order.TotalProductCount__c = mapOrderItem.get('totalQuantity');
            order.TotalPrice__c = mapOrderItem.get('totalPrice');
            newListOrders.add(order);
        }
        System.debug(newListOrders);
        update newListOrders;

    }
}