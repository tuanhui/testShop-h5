import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/ApiService';
import { Order } from '../../shared/Order';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public orderList: Order[] = [];
  public showLoading: boolean = false;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private title: Title
  ) { 
    title.setTitle("订单列表");
  }

  ngOnInit() {
    if(! this.apiService.mOpenId) {
      this.apiService.mOpenId = sessionStorage.getItem("openId") || '';
      if(!this.apiService.mOpenId) { 
        window.location.href = this.apiService.getHomeHref();
        return;
      }
    }
    this.showLoading = true;
    this.apiService.getOrderList().subscribe((orderList) => {
      this.showLoading = false;
      this.orderList = orderList;
    });
  }
  toBuy(orderId: string) {
    if(!orderId) {
      return;
    }
    let requestData = {
      "orderId": orderId
    };
    sessionStorage.setItem("buy", JSON.stringify(requestData));
    window.location.href = "./assets/order.html" 
  }

  toOrderDetail(orderId){
    this.router.navigateByUrl("order/"+orderId);
  }
}
