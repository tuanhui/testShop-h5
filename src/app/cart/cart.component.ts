import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Product } from '../../shared/Product';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/ApiService';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public checkedCount: number;
  public totalPrice: number = 0;
  public carts: Product[] = [];
  public showLoading: boolean;
  public loadingTitle: string;
  private serverProducts: Product[];

  constructor(
    private title: Title,
    private router: Router,
    private apiService: ApiService
    ) {
      title.setTitle('购物车');
   }
  plus(index){
      let tmp = this.carts[index];
      if(tmp.count == 999) {
        return;
      }
      tmp.count ++;
      this.totalPrice +=(tmp.itemPrice/1);
      this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }
  minus(index){
      let tmp = this.carts[index];
      if(tmp.count == 1) {
        return;
      }
      tmp.count --;
      this.totalPrice -= (tmp.itemPrice/1);
      this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }
  onProductCountChange(value, index){
    if(!value) {
      setTimeout(()=> {
        let tmp = this.carts[index];
        tmp.count = 1;
        this.totalPrice = 0;
        for(let i in this.carts) {
          let tmp = this.carts[i];
          if(tmp.checked) {
             this.totalPrice  += tmp.count*tmp.itemPrice;
          }
        }
        this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
      }, 10);
    } else {
      if(value > 999) {
        setTimeout(()=>{
          let tmp = this.carts[index];
          tmp.count = 999;
          this.totalPrice = 0;
          for(let i in this.carts) {
            let tmp = this.carts[i];
            if(tmp.checked) {
               this.totalPrice += tmp.count*tmp.itemPrice;
            }
          }
          this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
        }, 10);
      } else {
        let tmp = this.carts[index];
        tmp.count = value;
        this.totalPrice = 0;
        for(let i in this.carts) {
          let tmp = this.carts[i];
          if(tmp.checked) {
            this.totalPrice += tmp.count*tmp.itemPrice;
           }
        }
        this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
      }
    }
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
    this.loadingTitle = '加载中...';
    this.totalPrice = 0;
    this.checkedCount = 0;
    let openId = this.apiService.mOpenId;

    sessionStorage.setItem('newIntoCart', "true");
    let localCartsStr = sessionStorage.getItem(openId);
    try {
      let carts = JSON.parse(localCartsStr) as Product[];
      if(carts && carts.length > 0) {
          this.apiService.getServerProducts().subscribe((products) => {
            this.showLoading = false;
            if(products && products.length > 0) {
              for (let i=0; i<carts.length; i++) {
                  let cart = carts[i];
                  for(let j=0; j<products.length; j++){
                    let product = products[j];
                    if(product.itemId == cart.itemId) {
                      cart.itemPrice = product.itemPrice;
                      cart.itemOriginalPrice = product.itemOriginalPrice;
                      cart.itemName = product.itemName;
                      cart.itemIntro = product.itemIntro;
                      cart.itemImg = product.itemImg;
                      break;
                    }
                  }
              }
              this.carts = carts;
              if(this.carts) {
                for(let index in this.carts) {
                  let tmp = this.carts[index];
                  this.totalPrice += tmp.count*tmp.itemPrice;
                  tmp.checked = true;
                  this.checkedCount ++;
                }
              }
            }
          });
      } else {
        this.showLoading = false;
      }
    } catch(error) {
        console.dir(error);
        window.location.href = this.apiService.getProductHref();
    }
  }
  changeCheck(index) {
    let cart = this.carts[index];
    let isChecked = !cart.checked;
    if(isChecked) {
      this.checkedCount ++;
      this.totalPrice += cart.count*cart.itemPrice;
    } else {
      this.checkedCount --;
      this.totalPrice -= cart.count*cart.itemPrice;
    }
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
    this.carts[index].checked = isChecked;
  }
  delCarts(){
    let result = window.confirm('确定删除选中的产品?')
    if(result) {
      for(let i=this.carts.length-1; i>=0; i--) {
        var tmp = this.carts[i];
        if(tmp.checked) {
            this.carts.splice(i, 1);
            this.checkedCount --;
            this.totalPrice -= tmp.count*tmp.itemPrice;
        }
      }
      this.totalPrice = parseFloat(this.totalPrice.toFixed(2));

      var openId = this.apiService.mOpenId;
      sessionStorage.setItem(openId, JSON.stringify(this.carts));
    }
  }
  doCheckAll(){
    this.totalPrice = 0;
    if(this.checkedCount == this.carts.length) {
        for(let index in this.carts) {
          this.checkedCount = 0;
          this.carts[index].checked = false;
        }
    } else {
        this.totalPrice = 0;
        for(let index in this.carts) {
          let tmp = this.carts[index];
          tmp.checked = true;
          this.checkedCount ++;
          this.totalPrice += tmp.count*tmp.itemPrice;
        }
    }
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }
  //支付
  toPay(){
    let carts: Product[] = [];
    for(let i in this.carts) {
      let tmp = this.carts[i];
      if(tmp.checked) {
        carts.push(tmp);
      }
    }
    this.apiService.mCartProducts = carts;
    this.router.navigate(['order/buy']);
  }
}
