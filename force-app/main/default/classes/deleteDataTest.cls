@isTest
public with sharing class deleteDataTest {
    @testSetup
    static void setup() {
        List<Account> accounts = new List<Account>();
        for (Integer i=0;i<10;i++) {
            accounts.add(new Account(name='Account-'+i));
        }
            insert accounts;
    }

    @isTest 
    static void test() {

        Test.startTest();

        Integer pack = 10;    
        generateDataHelper.initiateAccountDeleteBatch(pack); 
        //deleteData d = new deleteData();
        //Database.executeBatch(d, pack);

        Test.stopTest();
        Integer countAcc = [select count() from Account where Name LIKE '%ccount-%'];
        System.assertEquals(0, countAcc);
    }
}