import { IProductInOrder } from './product-in-order.interface';

export type TStatus = 'OPENED' | 'IN_PROGRESS' | 'SHIPPED' | 'CLOSED';

export interface IOrder {
  id: number;
  title: string;
  madeAt: Date;
  products: IProductInOrder[];
  status: TStatus;
  totalPrice: number;
}
