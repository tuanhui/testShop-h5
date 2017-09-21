import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Order } from '../../shared/Order';
import { Product } from '../../shared/Product';
import { ApiService } from '../../shared/ApiService';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  public order: Order = new Order();
  public products: Product[] = [];
  public discountsPrice: number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private title: Title) {
      title.setTitle("订单详情");
    }

  ngOnInit() {
    if(! this.apiService.mOpenId) {
      this.apiService.mOpenId = sessionStorage.getItem("openId") || '';
      if(!this.apiService.mOpenId) {
        window.location.href = this.apiService.getHomeHref();
        return;
      }
    }
      this.route.params.subscribe(e => {
        var orderId = e.orderId;
        this.apiService.getOrderDetail(orderId).subscribe(rows=>{
            if(rows && rows.length > 0) {
              this.order = rows[0] as Order;
              let products = this.order["items"];
              let price1 = 0;
              let price2 = 0;
              for(let i in products) {
                let product = products[i];
                price1 += product.itemPrice * product.count /1;
                price2 += product.itemOriginalPrice * product.count /1;
              }
              let discountsPrice = price2 - price1;
              if (discountsPrice < 0) {
                discountsPrice  = 0;
              }
              this.order.orderTotalPrice = price1;
              this.discountsPrice = discountsPrice;
              this.products = products;
            }
        });
      });
  }
}
