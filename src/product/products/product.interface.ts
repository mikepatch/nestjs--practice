export interface IProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  categoryId: number;
  description?: string;
}
