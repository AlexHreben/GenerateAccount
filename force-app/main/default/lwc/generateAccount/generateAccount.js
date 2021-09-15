import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import prepareData from '@salesforce/apex/generateDataHelper.prepareData';
import makeFun from '@salesforce/apex/generateDataHelper.makeFun';
import getLoading from '@salesforce/apex/generateDataHelper.getLoading';
import countPercents from '@salesforce/apex/generateDataHelper.countPercents';
import getBatchJobStatus from '@salesforce/apex/generateDataHelper.getBatchJobStatus';

export default class GenerateAccount extends LightningElement {

    isVisitableDelete = false;
    @api accountNumberSize;
    @api packSize;
    //@api loadingNumber;
    @api percentage;
    @track jobPercentage;
    @track totalJobItems;
    @track jobItemsProcessed;
    processing = true;
    @api processing;
    @api jobID;
    @track error;
    @track record;
    @track viewProgress; 
    @track status;
    @track showDebug = false;
    @api apexJob;
    @api progress = 0;
    //@wire (getLoading) loadingNumber

    //@wire (prepareData, {acc: '$accountNumberSize', pack: '$packSize'})

    handleChangeNumberAcc(event) {
        this.accountNumberSize = event.detail.value;
    }

    handleChangePackSize(event) {
        this.packSize = event.detail.value;
    }



    handleStart() {
        prepareData({
            acc : this.accountNumberSize,
            pack : this.packSize
        })
        .then(result => {
            const event = new ShowToastEvent({
                title: 'Party start',
                message: 'Working',
                variant: 'success'
            });
            this.dispatchEvent(event);
            console.log(result);

        })
        .catch(error => {
            const event = new ShowToastEvent({
                title : 'Panic!',
                message : 'Error genetating account. ',
                variant : 'error'
            });
            this.dispatchEvent(event);
            console.log(error);
        })
        makeFun()
        .then(result => {
            const event = new ShowToastEvent({
                title: 'Just fun begin',
                message: 'Bggggg',
                variant: 'success'
            });
            console.log(result);
            this.dispatchEvent(event);
        })
        countPercents(
            this.percentage = countPercents
        )
    }



    viewProgressTracker(){
        prepareData({
            acc : this.accountNumberSize,
            pack : this.packSize
        })
        console.log("Clicked view progress!")
        this.viewProgress = true;
        
        getBatchJobStatus({ jobID : this.jobID })
        .then(result => {
            //Apex method returns type ID
            console.log(this.record);
            this.record = result;
        })
        .catch(error => {
            this.error = error;
            console.log('this.error' + this.error);
            
        });

        this.processing = true;
        this.totalJobItems = this.record.TotalJobItems;
        this.jobItemsProcessed = this.record.JobItemsProcessed;
        this.status = this.record.Status;
        
        this.jobPercentage = (this.jobItemsProcessed / this.totalJobItems)*100;

        if(this.jobPercentage === 100){
            this.processing = false;
        }

        console.log('this.record' + this.record);
        console.log('this.record.totalJobItems' + this.record.TotalJobItems);
        console.log('this.processing' + this.processing);
    }
}