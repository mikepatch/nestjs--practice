import { IProduct } from '../../product/products/product.interface';

export interface ProductInOrder {
  id: number;
  productId: IProduct['id'];
  quantity: number;
}
