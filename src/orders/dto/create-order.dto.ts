import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IProductInOrder } from '../model/product-in-order.interface';
import { TStatus } from '../model/order.interface';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  products: IProductInOrder[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  status?: TStatus;
}
