import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { ApiService } from '../../shared/ApiService';
import { Product } from '../../shared/Product';
import { Cart } from '../../shared/Cart';
import { Invoice } from '../../shared/Invoice';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.css']
})
export class OrderConfirmComponent implements OnInit {
  public mCart: Cart = new Cart();
  public isShowInvoice: boolean = false;
  public inputInvoice: boolean = false;
  public showToast: boolean = false;
  public isFromCart: boolean;
  public toastText: string;
  public compnayName: string;
  public identifyCode: string;
  public checkType: string;

  public all: Array<object>;                         //存储所有的省市区数据
  public provinces: Array<object>;                    //存储省的信息
  public citys: Array<object>;                       //存储城市的信息
  public areas: Array<object>;                         //存储地区的信息
  public cityValue: string;                               //重置城市选择器时用到的变量
  public areaValue: string;                            //重置地区选择器时用到的变量

  public provinceName: string;
  public cityeName: string;
  public areaName: string;
  public streetName: string;

  public showAddress: boolean;
  public showLoading: boolean;

  public loadingText: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private title: Title
  ) {
    title.setTitle("确认订单");
  }
  ngOnInit() {
    if(! this.apiService.mOpenId) {
      this.apiService.mOpenId = sessionStorage.getItem("openId") || '';
      if(!this.apiService.mOpenId) {
        window.location.href = this.apiService.getHomeHref();
        return;
      }
    }
    this.loadingText = "正在加载...";
    this.showAddress = false;
    this.showLoading = true;
    this.apiService.getServerProducts().subscribe((products) => {
      this.showLoading = false;
      if(products && products.length > 0) {
          let cartProducts = this.apiService.mCartProducts;
          if(!cartProducts || cartProducts.length == 0) {
            window.location.href = this.apiService.getProductHref();
            return;
          }
          for(let key in cartProducts) {
            let cartProduct = cartProducts[key];
            for(let tmpkey in products) {
              let product = products[tmpkey];
              if(product.itemId == cartProduct.itemId) {
                cartProduct.itemPrice = product.itemPrice;
                cartProduct.itemOriginalPrice = product.itemOriginalPrice;
                cartProduct.itemName = product.itemName;
                cartProduct.itemIntro = product.itemIntro;
                cartProduct.itemImg = product.itemImg;
                break;
              }
            }
          }
          this.mCart.invoice = new Invoice();
          this.mCart.products = cartProducts;
          this.mCart.openid = this.apiService.mOpenId;
          this.mCart.total_price = 0;
          this.mCart.orderType = "2";
          this.mCart.distribution = "顺丰快递";
          this.mCart.total_freight = 0;
          let totalPrice = 0;
          for(var i in this.mCart.products) {
            let product = this.mCart.products[i];
            totalPrice += product.count*product.itemOriginalPrice/1;
            this.mCart.total_price+= product.count*product.itemPrice/1;
          }
          this.mCart.total_preferential = totalPrice - this.mCart.total_price;
          if(this.mCart.total_preferential < 0) {
            this.mCart.total_preferential = 0;
          }
        }
    });
    this.setAll();
  }
  private setAll() {
    this.apiService.setAll()
      .subscribe(
        data => {
          this.all = data;
          this.provinces = this.setProvinces();
        }
      );
  }
  private setProvinces() {
    if (this.all !== undefined ) {
      const result = new Array<object>();
      for (let i = 0; i < this.all.length; i++) {
        const value = this.all[i];
        if (value['value'].slice(2, 6) === '0000') {
          result.push(value);
        }
      }
      return result;
    }
  }
  private setCity(province: string) {
    if (this.all !== undefined) {
      const result = new Array();
      for (let i = 0; i < this.all.length; i++) {
        const value = this.all[i];
        if (value['value'].slice(0, 2) === province.slice(0, 2)
          && value['value'] !== province && value['value'].slice(4, 6) === '00') {
          result.push(value);
        }
      }
      return result;
    }
  }
  private setArea(city: string) {
    if (this.all !== undefined) {
      const result = [];
      for (let i = 0; i < this.all.length; i++) {
        const value = this.all[i];
        if (value['value'] !== city && value['value'].slice(0, 4) === city.slice(0, 4)) {
          result.push(value);
        }
      }
      return result;
    }
  }
  public changeProvince(value){
    let province;
    try{
      province = this.provinces[value];
    } catch (error) {
    }
    if(province) {
      this.citys = this.setCity(province.value);
      this.provinceName = province.name;
      this.cityeName = '';
      this.areaName = '';
    }
  }
  public changeCity(value){
    let city;
    try{
      city = this.citys[value];
    } catch (error) {
    }
    if(city) {
      this.areas = this.setArea(city.value);
      this.cityeName = city.name;
      this.areaName = '';
    }
  }
  public changeArea(value){
    let area;
    try{
      area = this.areas[value];
    } catch (error) {
    }
    if(area) {
      this.areaName = area.name;
    }
  }
  showInvoice(){
    this.isShowInvoice = true;
  }
  tapInvoice() {
    this.inputInvoice = true;
  }
  ngAfterViewChecked(){
    if(!this.apiService.mCartProducts) {
      this.router.navigateByUrl("product");
      return;
    }
  } 
plus(index){
    let tmp:Product = this.mCart.products[index];
    if(tmp.count == 999) {
      return;
    }
    tmp.count ++;
    this.mCart.total_price += tmp.itemPrice /1;
    this.mCart.total_price = parseFloat(this.mCart.total_price.toFixed(2));
    this.mCart.total_preferential += (tmp.itemOriginalPrice /1 - tmp.itemPrice /1);
    this.mCart.total_preferential = parseFloat(this.mCart.total_preferential.toFixed(2));
    if(this.mCart.total_preferential < 0) {
      this.mCart.total_preferential = 0;
    }
}
minus(index){
    let tmp = this.mCart.products[index];
    if(tmp.count == 1) {
      return;
    }
    tmp.count --;
    this.mCart.total_price -= tmp.itemPrice /1;
    this.mCart.total_price = parseFloat(this.mCart.total_price.toFixed(2));
    this.mCart.total_preferential -= (tmp.itemOriginalPrice /1 - tmp.itemPrice /1);
    this.mCart.total_preferential = parseFloat(this.mCart.total_preferential.toFixed(2));
    if(this.mCart.total_preferential < 0) {
      this.mCart.total_preferential = 0;
    }
}
onProductCountChange(value, index){
  if(!value) {
    setTimeout(()=> {
      let tmp = this.mCart.products[index];
      tmp.count = 1;
      this.mCart.total_price = 0;
      let totalPrice: number = 0;
      for(let i in this.mCart.products) {
        let tmp = this.mCart.products[i];
        totalPrice += tmp.count*tmp.itemOriginalPrice/1;
        this.mCart.total_price += tmp.count*tmp.itemPrice/1;
      }
      this.mCart.total_price = parseFloat(this.mCart.total_price.toFixed(2));
      this.mCart.total_preferential = totalPrice - this.mCart.total_price;
      this.mCart.total_preferential = parseFloat(this.mCart.total_preferential.toFixed(2));
      if(this.mCart.total_preferential < 0) {
        this.mCart.total_preferential = 0;
      }
    }, 10);
  } else {
    if(value > 999) {
      setTimeout(()=>{
        let tmp = this.mCart.products[index];
        tmp.count = 999;
        this.mCart.total_price = 0;
        let totalPrice: number = 0;
        for(let i in this.mCart.products) {
          let tmp = this.mCart.products[i];
          totalPrice += tmp.count*tmp.itemOriginalPrice/1;
          this.mCart.total_price += tmp.count*tmp.itemPrice/1;
        }
        this.mCart.total_price = parseFloat(this.mCart.total_price.toFixed(2));
        this.mCart.total_preferential = totalPrice - this.mCart.total_price;
        this.mCart.total_preferential = parseFloat(this.mCart.total_preferential.toFixed(2));
        if(this.mCart.total_preferential < 0) {
          this.mCart.total_preferential = 0;
        }
      }, 10);
    } else {
      let tmp = this.mCart.products[index];
      tmp.count = value;
      this.mCart.total_price = 0;
      let totalPrice: number = 0;
      for(let i in this.mCart.products) {
        let tmp = this.mCart.products[i];
        totalPrice += tmp.count*tmp.itemOriginalPrice/1;
        this.mCart.total_price += tmp.count*tmp.itemPrice/1;
      }
      this.mCart.total_price = parseFloat(this.mCart.total_price.toFixed(2));
      this.mCart.total_preferential = totalPrice - this.mCart.total_price;
      this.mCart.total_preferential = parseFloat(this.mCart.total_preferential.toFixed(2));
      if(this.mCart.total_preferential < 0) {
        this.mCart.total_preferential = 0;
      }
    }
  }
}

  toBuy(){
    if(this.showLoading) {
      return;
    }
    let toastText: string = null;
    if(!this.mCart.owner) {
      toastText = '请输入收件人';
    }  else if(!this.mCart.phone) {
      toastText = '请输入手机号';
    } else if(! /^1[34578]{1}\d{9}$/.test(this.mCart.phone+"")){
      toastText = '手机号格式不正确';
    } else if(!this.mCart.address) {
      toastText = '请输入收货地址';
    } 
    if(toastText) {
      this.showToast = true;
      this.toastText = toastText;
      setTimeout(() => {
        this.showToast = false;
      }, 1500);
      return;
    }
    if(this.mCart.invoice && this.mCart.invoice["type"]  == "0") {
      this.mCart.invoice["username"] = this.mCart.owner;
    }
    if(! this.apiService.mOpenId) {
      this.apiService.mOpenId = sessionStorage.getItem("openId") || '';
      if(!this.apiService.mOpenId) {
        window.location.href = this.apiService.getHomeHref();
        return;
      }
    }
    
    this.mCart.openid = this.apiService.mOpenId;
    try {
        let localCartsStr = sessionStorage.getItem(this.mCart.openid);
        let localCarts: Product[];
        try{
          localCarts = JSON.parse(localCartsStr) as Product[];
          if(localCarts && localCarts.length > 0) {
              for(let i=localCarts.length-1; i>=0; i--) {
                for(var key in this.mCart.products) {
                  let product = this.mCart.products[key];
                  if(localCarts[i].itemId == product.itemId) {
                    localCarts.splice(i, 1);
                    break;
                  }
                }
              }
              sessionStorage.setItem(this.mCart.openid, JSON.stringify(localCarts));
          }
        }catch(e){
          console.dir(e);
        }
    }catch(error) {
      console.dir(error);
    }
    sessionStorage.setItem("buy", JSON.stringify(this.mCart));
    window.location.href = "./assets/order.html"    
  }
  handler(){
    return true;
  }
  ngOnDestory(){
    this.apiService.mInvoice = null;
    this.apiService.transDatas = {};
  }

  confirm(){
    if(this.checkType == "1") {
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
      this.mCart.invoice["type"] = this.checkType; 
      this.mCart.invoice["registration_number"] = this.identifyCode;
      this.mCart.invoice["company"] = this.compnayName;
    } else if(this.checkType == "0") {
      this.mCart.invoice["type"] = this.checkType;
      this.mCart.invoice["registration_number"] = null;
      this.mCart.invoice["company"] = null;
    } else {
        this.mCart.invoice = null;
    }
    
    this.inputInvoice = false;
  }
  chooseAddress(){
    this.showAddress = true;
  }
  changeOwner(){
    if(this.checkType != "0") {
      this.checkType = "0";
    } else {
      this.checkType = null;
    }
  }
  changeCompany(){
    if(this.checkType != "1") {
      this.checkType = "1";
    } else {
      this.checkType = null;
    } 
  }
  //确定收货地址
  confirmAddress() {
    let toastText;
    if(! this.provinceName) {
      toastText = '请选择省份';
    } else if(! this.cityeName) {
      toastText = '请选择市';
    } else if(! this.areaName) {
      toastText = '请选择区县';
    }else if(! this.streetName) {
      toastText = '请输入街道';
    }
    if(toastText) {
      this.showToast = true;
      this.toastText = toastText;
      window.setTimeout(()=>{
          this.showToast = false;
      }, 1500);
      return;
    }
    this.showAddress = false;
    this.mCart.address = this.provinceName+this.cityeName+this.areaName+this.streetName;
  }
}
