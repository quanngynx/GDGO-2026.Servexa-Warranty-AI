import { BaseApi } from "@/libs/axios";
import type {
  CustomerListApiResponse,
  ListCustomersParams,
} from "./data-transfer-object";

class CustomerApi extends BaseApi {
  findAll(params?: ListCustomersParams) {
    return this.tryGet<CustomerListApiResponse>(
      "/v1/human-resources/customers",
      { params }
    );
  }
}

export const customerApi = new CustomerApi();
