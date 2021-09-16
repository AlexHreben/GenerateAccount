public with sharing class deleteData implements Database.Batchable<sObject> {


    public List<Account> start(Database.BatchableContext BC){
       return [SELECT Id, Name FROM Account WHERE Name LIKE '%Account-%'];
    }
 
    public void execute(Database.BatchableContext BC, List<Account> scope){
      /*List<Account> acc = new List<Account>();
      for(Account account : scope){
         acc.add(account);
      }*/
      delete scope;
      DataBase.emptyRecycleBin(scope);
    }
 
    public void finish(Database.BatchableContext BC){
      System.debug('Entering finish delete method');
    }
 }