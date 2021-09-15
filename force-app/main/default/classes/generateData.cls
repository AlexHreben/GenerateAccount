global with sharing class generateData implements Database.Batchable<sObject>, Database.AllowsCallouts{
    
    Integer amount{get;set;}

    global generateData(Integer amountInt){ 
        amount = amountInt;
        System.debug('amount is ' + amount);
     }

    global List<Account> start(Database.BatchableContext BC){
        List<Account> accounts = new List<Account>();
        
        for(Integer i = 1; i < amount; i++){
            Account account = new Account();
            account.Name = 'Account-' + i;
            accounts.add(account);
        }

        //String query = 'SELECT Id, Name FROM Account';

        return accounts;
    }

    global void execute(Database.BatchableContext bc, List<Account> scope){
        System.debug(JSON.serializePretty(scope));
        //itemJobs = job.JobItemsProcessed;
        try {
            if(scope.size()>0){
                insert scope;
            }
            } catch(Exception e) {
                System.debug(e);
            }
    }

    global void finish(Database.BatchableContext bc){
        System.debug('Entering finish method');
    }
}