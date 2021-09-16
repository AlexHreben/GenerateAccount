public with sharing class generateDataHelper {
    
    public static Integer numberAccount;
    public static Integer packSize;
    public static Integer loading;
    public static Integer percents;

    @AuraEnabled
    public static void prepareData(Integer acc, Integer pack){
        numberAccount = acc;
        packSize = pack;
    }

    @AuraEnabled(cacheable = false)
    public static AsyncApexJob getBatchJobStatus(Id jobID){
        AsyncApexJob jobInfo = [SELECT Status, NumberOfErrors,JobItemsProcessed,TotalJobItems FROM AsyncApexJob WHERE Id = :jobID];
        return jobInfo;
    }

    @AuraEnabled
    public static Id initiateAccountDeleteBatch(Integer numberOfPack){
        System.debug('ENTERED INITIATE AURA DELETE METHOD');
        Id jobId = Database.executeBatch(new deleteData(), numberOfPack);
        System.debug('JOB ID >> ' + jobId);
        return jobId;
    }

    @AuraEnabled
    public static Id initiateAccountBatch(Integer numberOfRecords, Integer numberOfPack) {
        System.debug('ENTERED INITIATE AURA ENABLED METHOD');
        numberAccount = numberOfRecords;
        
        Id jobId = Database.executeBatch(new generateData(numberOfRecords), numberOfPack);
        //generateData data = new generateData(numberOfRecords);
        //Id jobId = Database.executeBatch(data, numberOfPack);
        System.debug('JOB ID >> ' + jobId);
        return jobId;
    }

}