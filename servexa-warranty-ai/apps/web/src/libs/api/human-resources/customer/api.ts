import { BaseApi } from '@/libs/axios'
import type {
  CustomerApiResponse,
  RequestCreateCustomerDto,
  RequestListCustomersDto,
  RequestUpdateCustomerDto,
  ResponseCustomerDto,
  ResponseCustomerListDto,
} from './data-transfer-object'

class CustomerAPI extends BaseApi {
  findAll(params?: RequestListCustomersDto) {
    return this.tryGet<CustomerApiResponse<ResponseCustomerListDto>>(
      '/v1/human-resources/customers',
      { params },
    )
  }

  findOneById(customerId: string) {
    return this.tryGet<CustomerApiResponse<ResponseCustomerDto>>(
      `/v1/human-resources/customers/${customerId}`,
    )
  }

  createCustomer(data: RequestCreateCustomerDto) {
    return this.tryPost<CustomerApiResponse<ResponseCustomerDto>, RequestCreateCustomerDto>(
      '/v1/human-resources/customers',
      data,
    )
  }

  updateCustomer(customerId: string, data: RequestUpdateCustomerDto) {
    return this.tryPatch<CustomerApiResponse<ResponseCustomerDto>, RequestUpdateCustomerDto>(
      `/v1/human-resources/customers/${customerId}`,
      data,
    )
  }

  deleteCustomer(customerId: string) {
    return this.tryDelete<CustomerApiResponse<{ success: boolean }>>(
      `/v1/human-resources/customers/${customerId}`,
    )
  }
}

export const customerAPI = new CustomerAPI()
