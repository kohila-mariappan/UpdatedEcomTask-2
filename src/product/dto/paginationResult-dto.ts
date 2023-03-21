import { ProductEntity } from "../entities/product.entity"
export class PaginatedResultDto {
  items: ProductEntity[]
  totalCount: number
}