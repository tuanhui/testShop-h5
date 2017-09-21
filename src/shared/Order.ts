import { Product } from './Product';
import { Invoice } from './Invoice';
export class Order {
    createTime: string = "";
    invoice: Invoice;
    invoiceId: string = "";
    items: Product[];
    lastModifiedTime: string = "";
    orderDiscount: string = "";
    orderDistribution: string = "";
    orderFreight: string = "";
    orderId: string = "";
    orderOpenid: string = "";
    orderOwner: string = "";
    orderRemark: string = "";
    orderStatus: string = "";
    orderTotalPayment: number;
    orderTotalPrice: number;
    ownerAddr: string = "";
    ownerPhone: number;
    transactionId: string = ""
}