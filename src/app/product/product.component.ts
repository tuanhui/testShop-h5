import { Component, OnInit, ElementRef } from '@angular/core';
import { ApiService } from '../../shared/ApiService';
import { Product } from '../../shared/Product';
import { ServerResult } from '../../shared/ServerResult';
import { ActivatedRoute, ParamMap, Router, Params} from '@angular/router';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  public products: any;
  public dotIndex: number = 0;
  public timeValues: string[];
  public isActive: boolean = false;
  public timer: any;
  public hours: string;
  public minutes: string;
  public seconds: string;
  public showLoading: boolean = false;
  public activePre: boolean = false;

    public slides: string[];
    public config: SwiperConfigInterface = {
      scrollbar: null,
      direction: 'horizontal',
      slidesPerView: 1,
      scrollbarHide: false,
      autoplay: 5000,
      autoplayDisableOnInteraction: false,
      keyboardControl: true,
      mousewheelControl: true,
      scrollbarDraggable: true,
      scrollbarSnapOnRelease: true,
      paginationClickable: true
    };
  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private title: Title  
  ) {
    title.setTitle('华大基因 | 优康门诊');
  }
  toDetail(index: number) {
    let tmpProduct:Product  = (index >= 0 && index < this.products.length) ? this.products[index] : null;
    if(tmpProduct) {
      this.apiService.mProduct = tmpProduct;
      this.router.navigate(['product/'+tmpProduct.itemId]);
    }
  }
  ngOnInit() {
    this.activePre = false;
    this.showLoading = true;
    let date = new Date();
    let mTime = date.valueOf();
    let date1 = new Date(mTime - 86400000);
    let date2 = new Date(mTime + 86400000);
    let date3 = new Date(mTime + 172800000);
    this.timeValues = [
      (date1.getMonth() + 1) + '月' + date1.getDate() + '日',
      (date.getMonth() + 1) + '月' + date.getDate() + '日',
      (date2.getMonth() + 1) + '月' + date2.getDate()+'日',
      (date3.getMonth() + 1) + '月' + date3.getDate() + '日',
    ]
    
    if (! this.apiService.mOpenId) {
      this.apiService.mOpenId = sessionStorage.getItem("openId") || '';
      if(!this.apiService.mOpenId) {
        window.location.href = this.apiService.getHomeHref();
        return;
      }
    }

    this.apiService.getProductResults().subscribe(res=>{
      this.showLoading = false;
      let products: Product[] = (res.rows as Product[]) || [];
      let product: Product;
      for(var i=0; i<products.length; i++) {
          if(products[i].itemName.indexOf("安全用药") != -1) {
              product = products[i];
              products.splice(i, 1);
            break;
          }
      }
      if(product) {
        products.unshift(product);
      }
      this.products = products;
      this.slides = res.msgStr as string[] || [];
      this.isActive = "20170909" === res.object;
      this.activePre  = parseInt(res.object) < 20170909;
      if(this.isActive){
        let arr = "2017-09-09 23:59:59:999".split(/[- :]/);
        let finishTime = new Date(parseInt(arr[0]), parseInt(arr[1])-1, parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4]), parseInt(arr[5]), parseInt(arr[6])).valueOf();
        let mDate = new Date();
        let currentTtime = mDate.valueOf();
        if(finishTime - currentTtime <= 0) {
          this.isActive = false;
        } else {
          let finishDate = new Date(finishTime);
          let hours = finishDate.getHours() - mDate.getHours();
          let minutes = finishDate.getMinutes() - mDate.getMinutes();
          let seconds = finishDate.getSeconds() - mDate.getSeconds();

          this.hours = hours < 10 ? ('0'+hours) : hours+'';
          this.minutes = minutes < 10 ? ('0'+minutes) : minutes+'';
          this.seconds = seconds < 10 ? ('0'+seconds) : seconds+'';
          this.refreshTime();
        }
      }
    })
  } 
  refreshTime() {
    this.timer && clearInterval(this.timer);
    this.timer = setInterval(()=>{
      let mDate = new Date();
      let currentTtime = mDate.valueOf();
      let arr = "2017-09-09 23:59:59:999".split(/[- :]/);
      let finishTime = new Date(parseInt(arr[0]), parseInt(arr[1])-1, parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4]), parseInt(arr[5]), parseInt(arr[6])).valueOf();
      let finishDate = new Date(finishTime);
      if(finishTime - currentTtime <= 0) {
        this.isActive = false;
        this.timer && clearInterval(this.timer);
      } else {
        let hours = finishDate.getHours() - mDate.getHours();
        let minutes = finishDate.getMinutes() - mDate.getMinutes();
        let seconds = finishDate.getSeconds() - mDate.getSeconds();

        this.hours = hours < 10 ? ('0'+hours) : hours+'';
        this.minutes = minutes < 10 ? ('0'+minutes) : minutes+'';
        this.seconds = seconds < 10 ? ('0'+seconds) : seconds+'';
      }
    }, 1000);
  }

  onIndexChange(index: number) {
    this.dotIndex = index;
  }
}
