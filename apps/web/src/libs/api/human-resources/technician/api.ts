import { BaseApi } from "@/libs/axios";

import type { BaseApiResponse } from "../../bases/base-response";
import type { ListTechniciansParams, TechnicianListResponse } from "./data-transfer-object";

class TechnicianApi extends BaseApi {
  findAll(params?: ListTechniciansParams) {
    return this.tryGet<BaseApiResponse<TechnicianListResponse>>(
      "/v1/human-resources/technicians",
      { params },
    );
  }
}

export const technicianApi = new TechnicianApi();
