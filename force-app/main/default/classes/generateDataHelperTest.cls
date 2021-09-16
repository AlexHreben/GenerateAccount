@isTest
public with sharing class generateDataHelperTest {

    @isTest static void testPrepareData1() {

        Integer accNumber = 100;
        Integer pack = 10;

        Test.startTest();
        generateDataHelper.prepareData(accNumber,pack);
        Test.stopTest();

        System.assertEquals(accNumber, generateDataHelper.numberAccount);
    }

    @isTest static void testPrepareData2() {

        Integer accNumber = 100;
        Integer pack = 10;

        Test.startTest();
        generateDataHelper.prepareData(accNumber,pack);
        Test.stopTest();

        System.assertEquals(pack, generateDataHelper.packSize);
    }

    @isTest static void testGetBatchJobStatus() {

        Integer accNumber = 100;
        Integer pack = 10;
        
        Test.startTest();
        Id jobId = Database.executeBatch(new generateData(accNumber), pack);
        AsyncApexJob jobInfoMethod = generateDataHelper.getBatchJobStatus(jobId);
        AsyncApexJob jobInfo = [SELECT Status, NumberOfErrors,JobItemsProcessed,TotalJobItems FROM AsyncApexJob WHERE Id = :jobID];
        Test.stopTest();

        System.assertEquals(jobInfoMethod, jobInfo);
    }
}
