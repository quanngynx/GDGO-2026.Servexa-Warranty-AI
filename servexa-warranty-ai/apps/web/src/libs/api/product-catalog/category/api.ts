import { BaseApi } from '@/libs/axios'
import type {
  CategoryApiResponse,
  RequestCreateCategoryDto,
  RequestListCategoriesDto,
  RequestUpdateCategoryDto,
  ResponseCategoryDto,
  ResponseCategoryListDto,
} from './data-transfer-object'

class CategoryAPI extends BaseApi {
  findAll(params?: RequestListCategoriesDto) {
    return this.tryGet<CategoryApiResponse<ResponseCategoryListDto>>(
      '/v1/product-catalog/categories',
      { params },
    )
  }

  findOneById(categoryId: string) {
    return this.tryGet<CategoryApiResponse<ResponseCategoryDto>>(
      `/v1/product-catalog/categories/${categoryId}`,
    )
  }

  createCategory(data: RequestCreateCategoryDto) {
    return this.tryPost<CategoryApiResponse<ResponseCategoryDto>, RequestCreateCategoryDto>(
      '/v1/product-catalog/categories',
      data,
    )
  }

  updateCategory(categoryId: string, data: RequestUpdateCategoryDto) {
    return this.tryPatch<CategoryApiResponse<ResponseCategoryDto>, RequestUpdateCategoryDto>(
      `/v1/product-catalog/categories/${categoryId}`,
      data,
    )
  }

  deleteCategory(categoryId: string) {
    return this.tryDelete<CategoryApiResponse<{ success: boolean }>>(
      `/v1/product-catalog/categories/${categoryId}`,
    )
  }
}

export const categoryAPI = new CategoryAPI()
