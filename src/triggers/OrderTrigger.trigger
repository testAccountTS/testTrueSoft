trigger OrderTrigger on OrderItem__c (after insert) {
    
    if (Trigger.isInsert && Trigger.isAfter) {
        OrderTotalTriggerHandler.onAfterInsert(Trigger.new);
    }
}