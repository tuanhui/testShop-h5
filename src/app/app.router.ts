import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';
import { HomeComponent } from './home/home.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

export const router: Routes  = [
    { path: '', redirectTo: 'home',pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'product', component: ProductComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'order', component: OrderComponent },
    { path: 'order/buy', component: OrderConfirmComponent },
    { path: 'order/buy/invoice', component: InvoiceComponent },
    { path: 'order/order_success', component: OrderSuccessComponent },
    { path: 'order/:orderId', component: OrderDetailComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router,{useHash: true});