import { routes } from './app.router';
import { NgModule, enableProdMode} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ApiService } from './../shared/ApiService';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { JsonpModule, HttpModule } from '@angular/http';
import { OrderComponent } from './order/order.component';
import { BrowserModule } from '@angular/platform-browser';
import { ProductComponent } from './product/product.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { AddressListComponent } from './address-list/address-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

import { SwiperModule, SwiperConfigInterface } from 'ngx-swiper-wrapper';

const SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  threshold: 50,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: true,
  keyboardControl: true
};
enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    OrderComponent,
    OrderDetailComponent,
    ProductComponent,
    ProductDetailComponent,
    OrderConfirmComponent,
    OrderSuccessComponent,
    HomeComponent,
    InvoiceComponent,
    AddressListComponent,
    AddAddressComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    JsonpModule,
    FormsModule,
    HttpModule,
    routes,
    SwiperModule.forRoot(SWIPER_CONFIG)
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
