import { IProduct } from '../../product/products/product.interface';

export interface IProductInOrder {
  id: number;
  productId: IProduct['id'];
  quantity: number;
}
