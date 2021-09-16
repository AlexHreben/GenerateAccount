import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getBatchJobStatus from '@salesforce/apex/generateDataHelper.getBatchJobStatus';
import initiateAccountBatch from '@salesforce/apex/generateDataHelper.initiateAccountBatch';
import initiateAccountDeleteBatch from '@salesforce/apex/generateDataHelper.initiateAccountDeleteBatch';

export default class MakeFun extends LightningElement {

    @track jobID;
    @track error;
    @track record;
    @track jobPercentage;
    @track totalJobItems;
    @track jobItemsProcessed;
    @track status;
    @track numberInputAccount = 0;
    @track numberInputPack = 0;
    @track createError;
    @track deleteError;

    handleChangeNumberAcc(event) {
        this.numberInputAccount = event.target.value;
        console.log('this.numberInputAccount' + this.numberInputAccount);
    }

    handleChangePackSize(event) {
        this.numberInputPack = event.target.value;
        console.log('this.handleChangePackSize' + this.numberInputPack);
    }

    createRecords() {
        initiateAccountBatch({ numberOfRecords: this.numberInputAccount, numberOfPack: this.numberInputPack })
            .then(result => {
                this.jobID = result;
                console.log('this.jobID - ' + this.jobID);
                this.record = result;
                this.progressCreateAccount();
            })
            .catch(error => {
                this.createError =  error;
                console.log('this.createError' + this.createError);
                const event = new ShowToastEvent({
                    title: 'We have a problem :(',
                    message: 'Something happens',
                    variant: 'error'
                });
                this.dispatchEvent(event);
            });
    }

    deleteRecords(){
        initiateAccountDeleteBatch({numberOfPack: this.numberInputPack})
        .then(result => {
            this.jobID = result;
            console.log('this.jobID - ' + this.jobID);
            this.record = result;
            this.progressDeleteAccount();
        })
        .catch(error => {
            this.deleteError =  error;
            console.log('this.deleteError' + this.deleteError);
            const event = new ShowToastEvent({
                title: 'We have a problem :(',
                message: 'Delete broke',
                variant: 'error'
            });
            this.dispatchEvent(event);
        });
    }

    progressDeleteAccount(){
        setTimeout(() => {
            getBatchJobStatus({ jobID: this.jobID })
            .then(result => {
                console.log('getBatchJobStatus/progressCreateAccount' , result);
                this.record = result;
                this.jobItemsProcessed = this.record.JobItemsProcessed;
                this.totalJobItems = this.record.TotalJobItems;
                console.log('this.totalJobItems-' + this.record.TotalJobItems);
                console.log('this.jobItemsProcessed-' + this.record.JobItemsProcessed);
                this.jobPercentage = Math.round(this.jobItemsProcessed / this.totalJobItems * 100);
                console.log('this.jobPercentage-' + this.jobPercentage);
                
                if (result.Status && result.Status != 'Completed'){
                    this.progressDeleteAccount();
                    console.log(result.Status);
                } else {
                    const event = new ShowToastEvent({
                        title: 'All accounts deleted!',
                        message: 'Success delete',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);
                    this.jobPercentage = 0;
                }
            })
            .catch(error => {
                this.error = error;
                console.log('this.error -' + this.error);
                
            })
        }, 300);
    }

    progressCreateAccount(){
        setTimeout(() => {
            getBatchJobStatus({ jobID: this.jobID })
            .then(result => {
                console.log('getBatchJobStatus/progressCreateAccount' , result);
                this.record = result;
                this.jobItemsProcessed = this.record.JobItemsProcessed;
                this.totalJobItems = this.record.TotalJobItems;
                console.log('this.totalJobItems-' + this.record.TotalJobItems);
                console.log('this.jobItemsProcessed-' + this.record.JobItemsProcessed);
                this.jobPercentage = Math.round(this.jobItemsProcessed / this.totalJobItems * 100);
                console.log('this.jobPercentage-' + this.jobPercentage);
                
                if (result.Status && result.Status != 'Completed'){
                    this.progressCreateAccount();
                    console.log(result.Status);
                } else {
                    const event = new ShowToastEvent({
                        title: 'All accounts created!',
                        message: 'Well done!',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);
                    this.jobPercentage = 0;
                }
            })
            .catch(error => {
                this.error = error;
                console.log('this.error -' + this.error);
            })
        }, 300);
    }
}
