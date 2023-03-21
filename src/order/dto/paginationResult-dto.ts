import { OrderEntity } from "../entities/order.entity"
export class PaginatedResultDto {
  orders: OrderEntity[]
  totalCount: number
}