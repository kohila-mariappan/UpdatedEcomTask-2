import { CategoryEntity } from "../entities/category.entity"
export class PaginatedResultDto {
  items: CategoryEntity[]
  totalCount: number
}