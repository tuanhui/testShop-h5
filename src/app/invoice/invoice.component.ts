import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/ApiService';
import { Invoice } from '../../shared/Invoice';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
 public compnayName: string;
 public identifyCode: string;
 public mInvoice:object = {};
 public checkType: number = -1;
 public toastText: string;
 public showToast: boolean = false;

  constructor(private apiService: ApiService) { }
  
  ngOnInit() {
    
  }

  confirm(){
    if(this.checkType == 1) {
      let toastText;
      if(!this.compnayName) {
        toastText = '请填写单位名称';
      } else if(!this.identifyCode) {
        toastText = '请填写纳税人识别号';
      }
      if(toastText) {
          this.showToast = true;
          this.toastText = toastText;
          window.setTimeout(()=>{
            this.showToast = false;
          },1500);
          return;
      }
      this.mInvoice["type"] = this.checkType; 
      this.mInvoice["registration_number"] = this.identifyCode;
      this.mInvoice["company"] = this.compnayName;
    } else if(this.checkType == 0) {
      this.mInvoice["type"] = this.checkType;
    } else {
        this.mInvoice = {};
    }
    
    this.apiService.mInvoice = this.mInvoice as Invoice;
    window.setTimeout(()=>{
      window.history.back();
    },1500);
  }

  changeOwner(){
    if(this.checkType != 0) {
      this.checkType = 0;
    } else {
      this.checkType = -1;
    }
  }
  changeCompany(){
    if(this.checkType != 1) {
      this.checkType = 1;
    } else {
      this.checkType = -1;
    } 
  }

}
