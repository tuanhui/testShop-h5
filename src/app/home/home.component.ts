import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ApiService } from '../../shared/ApiService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit() {
    // || location.href.indexOf('192.168.31.56') != -1
    if(location.href.indexOf('localhost:') != -1 || location.href.indexOf('172.16.162.14') != -1) {
      this.apiService.mOpenId = "oYTvZ1A17LJfMKz6tYHr6snz4Kn4";
      sessionStorage.setItem("openId", this.apiService.mOpenId);
      this.router.navigateByUrl("product");
      return;
    }
    if(location.hash.indexOf("openId") != -1) {
      let openId = location.hash.substring(location.hash.lastIndexOf("openId")+7);
      if(openId && openId.length > 5) {
        this.apiService.mOpenId = openId;
        sessionStorage.setItem("openId", openId);
        this.router.navigateByUrl("product");
        return;
      }
    }
    var wechat_redirect_url = this.apiService.getWechatRedirectUrl();
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3c81184a8feac2cb&redirect_uri='+ wechat_redirect_url +'&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect'
  }
}
