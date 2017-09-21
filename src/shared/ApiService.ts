import {Injectable} from '@angular/core';
import {Jsonp,Http, RequestOptions, Headers, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Product } from './Product';
import { Invoice } from './Invoice';
import { Order } from './Order';
import { ServerResult } from './ServerResult';
@Injectable()
export class ApiService {
    transDatas:object = {};
    mOpenId: string;
    mProduct: Product;
    mCartProducts: Product[];
    mInvoice: Invoice;
    constructor(private _jsonp: Jsonp, private http: Http) {
    }
    getProductResults(): Observable<ServerResult> {
        // || location.href.indexOf('192.168.31.56') != -1
        if(location.href.indexOf('localhost:') != -1 || location.href.indexOf('172.16.162.14') != -1) {
            return this.http.get('./assets/product.json').map(response => response.json() as ServerResult);
        }
        return this.http.get('/wechat/getAllWechatItems.action').map(response => response.json() as ServerResult);
    }
    getServerProducts(): Observable<Product[]>  {
        if(location.href.indexOf('localhost:') != -1 || location.href.indexOf('172.16.162.14') != -1) {
            return this.http.get('./assets/product.json').map(response => response.json().rows as Product[]);
        } 
        return this.http.get('/wechat/getAllWechatItems.action').map(response => response.json().rows as Product[]); 
    }
    getOrderList(): Observable<Order[]> {
        return this.http
       .get('/wechat/getWechatOrders.action?wcsOrder.orderOpenid='+this.mOpenId)
       .map(response => response.json().rows as Order[]);
    }
    getOrderDetail(openId: string): Observable<Order[]> {
        return this.http
        .get('/wechat/getWechatOrderDetail.action?orderId='+openId)
        .map(response => response.json().rows as Order[]);
    }
    //TODO 跳转到登录页面
    getHomeHref(): string {
        return '/wechat/#/home';
    }
    //TODO 跳转到商品列表页面
    getProductHref(): string {
        return '/wechat/#/product';
    }
    //TODO 返回微信登录后回调回来的url地址
    getWechatRedirectUrl(): string {
        return 'http://yk.canseq.com/wechat/officialAccountsIndex.action';
         //return 'https://mybgi.genomics.cn/wechat/officialAccountsIndex.action'; 
    }
    public setAll() {           //获取json中的数据
        if(location.href.indexOf('localhost:') != -1 || location.href.indexOf('172.16.162.14') != -1) {
            return this.http.get("./assets/area_list.json")
            .map((response: Response) => {
                const res = response.json();
                return res;
            })
            .catch((error: any) => Observable.throw('Server error' || error));
        }
        return this.http.get("/wechat/assets/area_list.json")
            .map((response: Response) => {
                const res = response.json();
                return res;
            })
            .catch((error: any) => Observable.throw('Server error' || error));
        }
}