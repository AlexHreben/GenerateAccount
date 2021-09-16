@isTest
public with sharing class generateDataTest {
    @testSetup static void setup() {
        List<Account> accounts = new List<Account>();
        for(Integer i = 1; i <= 11; i++){
            Account account = new Account();
            account.Name = 'Account-' + i;
            accounts.add(account);
        }

        try {
            if(accounts.size()>0){
                insert accounts;
            }
            } catch(Exception e) {
                System.debug(e);
            }
    }

    @isTest static void test1() {
        Test.startTest();
        //generateData genAcc = new generateData(10);
        //Id batchId = Database.executeBatch(genAcc);
        Integer accNumber = 10;
        Integer pack = 10;
        generateDataHelper.initiateAccountBatch(accNumber,pack);
        Test.stopTest();
        
        Integer countAcc = [select count() from Account where Name LIKE '%ccount-%'];
        System.assertEquals(accNumber * 2, countAcc);
    }


}
