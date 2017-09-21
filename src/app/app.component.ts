import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  imgs:any =  [];
  containerClass: any;
  constructor(private router: Router){
    this.adapt(750, 100);
    let index: number = 0;
    if(!location.hash || location.hash == '#/product'){
      index = 0;
    } else if(location.hash == '#/cart') {
      index = 1;
    } else if(location.hash == '#/order') {
      index = 2;
    }
    this.imgs =  ['./assets/imgs/ic_home_' + (index==0 ? 'press.png' : 'normal.png'), './assets/imgs/ic_shopping_cart_' + (index==1 ? 'press.png' : 'normal.png'), './assets/imgs/ic_mine_' + (index==2 ? 'press.png' : 'normal.png')];
  }
  showTabs(){
    
    if(!location.hash || location.hash == '#/home') {
      this.containerClass = { 'padding-bottom': '0rem'};
      return false;
    }
    let index = 0;
    if(location.hash === '#/product') {
        index = 0;
    } else if(location.hash === '#/cart') {
        index = 1;
    } else if(location.hash === '#/order') {
        index = 2;
    }
    this.imgs =  ['./assets/imgs/ic_home_' + (index==0 ? 'press.png' : 'normal.png'), './assets/imgs/ic_shopping_cart_' + (index==1 ? 'press.png' : 'normal.png'), './assets/imgs/ic_mine_' + (index==2 ? 'press.png' : 'normal.png')];
    if(location.hash.match(/\//g).length <= 1) {
      this.containerClass = { 'padding-bottom': '1.02rem'};
      return true;
    }
    this.containerClass = { 'padding-bottom': '0rem'};
    return false; 
  }
   adapt(designWidth, rem2px){
    var d = window.document.createElement('div');
    d.style.width = '1rem';
    d.style.display = "none";
    var head = window.document.getElementsByTagName('head')[0];
    head.appendChild(d);
    var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
    d.remove();
    document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSize * 100 + '%';
    var st = document.createElement('style');
    var portrait = "@media screen and (min-width: "+window.innerWidth+"px) {html{font-size:"+ ((window.innerWidth/(designWidth/rem2px)/defaultFontSize)*100) +"%;}}";
    var landscape = "@media screen and (min-width: "+window.innerHeight+"px) {html{font-size:"+ ((window.innerHeight/(designWidth/rem2px)/defaultFontSize)*100) +"%;}}"
    st.innerHTML = portrait + landscape;
    head.appendChild(st);
    return defaultFontSize
  };
  
  title = 'app';
  change(index){
    this.imgs =  ['./assets/imgs/ic_home_' + (index==0 ? 'press.png' : 'normal.png'), './assets/imgs/ic_shopping_cart_' + (index==1 ? 'press.png' : 'normal.png'), './assets/imgs/ic_mine_' + (index==2 ? 'press.png' : 'normal.png')];
    switch(index) {
      case 0:
        this.router.navigate(['product']);
        break;
      case 1:
        this.router.navigate(['cart']);
        break;
      case 2:
        this.router.navigate(['order']);
        break;
    }
  }
}
