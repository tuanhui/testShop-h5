import { Product } from './Product';
import { Invoice } from './Invoice'
export class Cart {
    orderType: string;
    openid: string;
    invoice: Invoice;
    owner: string;
    phone: number;
    address: string;
    remark: string;
    distribution: string;//配送方式
    total_freight: number;//邮费
    cart_price: number;//订单总价
    total_preferential: number;//优惠价格
    total_price: number;//支付价格
    products: Product[];
  }