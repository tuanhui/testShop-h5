import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { imgs } from '../../shared/ProductDetailImages';
import { ApiService } from '../../shared/ApiService';
import { Product } from '../../shared/Product';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  imgUrls: string[];
  product: Product;
  addCartSuccess: boolean;
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private apiService: ApiService) {
      this.product = apiService.mProduct;
      if(this.product && typeof this.product.itemId != "undefined") {
        this.imgUrls = imgs[this.product.itemId];
      }
    }
  ngOnInit() {
    if(! this.product) {
      this.router.navigateByUrl("product");
      return;
    }
    if(! this.apiService.mOpenId) {
      this.apiService.mOpenId = sessionStorage.getItem("openId") || '';
      if(!this.apiService.mOpenId) {
        window.location.href = this.apiService.getHomeHref();
        return;
      }
    }
  }
  addOrder(){
    if(! this.apiService.mOpenId) {
      this.apiService.mOpenId = sessionStorage.getItem("openId") || '';
      if(!this.apiService.mOpenId) {
        window.location.href = this.apiService.getHomeHref();
        return;
      }
    }
    let carts:Product[] = [];
    this.product.count = 1;
    carts.push(this.product);
    this.apiService.mCartProducts = carts;
    this.router.navigate(['order/buy']);
  }
  addCart(){
    this.product.count = 1;
    if(! this.apiService.mOpenId) {
      this.apiService.mOpenId = sessionStorage.getItem("openId") || '';
      if(!this.apiService.mOpenId) {
        window.location.href = this.apiService.getHomeHref();
        return;
      }
    }
    let openId = this.apiService.mOpenId;
    sessionStorage.setItem('newIntoCart', "true");
    let localCartsStr = sessionStorage.getItem(openId);
    let localCarts: Product[];
    try{
      localCarts = JSON.parse(localCartsStr) as Product[];
    }catch(e){
      console.dir(e);
    }
    let flag: boolean = false;
    if(localCarts && localCarts.length > 0) {
        for(let i in localCarts) {
          let tmp = localCarts[i];
          if(tmp.itemId == this.product.itemId) {
            flag = true;
            tmp.count = tmp.count /1 + 1;
            break;
          }
        }
    }
    if(!flag) {
        if(!localCarts) {
          localCarts = [];
        }
        localCarts.push(this.product);
    }
    sessionStorage.setItem(openId, JSON.stringify(localCarts));
    this.addCartSuccess = true;
    setTimeout(()=>{
      this.addCartSuccess = false;
    }, 1500);
  }
}
