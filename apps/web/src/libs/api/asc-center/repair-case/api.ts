import { BaseApi } from "@/libs/axios";
import type {
  RepairCaseImageDto,
  RepairCaseImageType,
  RequestCreateRepairCaseDto,
  RequestListRepairCasesDto,
  RequestUpdateRepairCaseDto,
  ResponseRepairCaseDetailDto,
  ResponseRepairCaseListDto,
} from "./data-transfer-object";
import type { BaseApiResponse } from "../../bases/base-response";

class RepairCaseAPI extends BaseApi {
  findAll(params?: RequestListRepairCasesDto) {
    return this.tryGet<ResponseRepairCaseListDto>(
      "/v1/asc-center/repair-cases",
      { params },
    );
  }
  findOneById(repairCaseId: string) {
    return this.tryGet<ResponseRepairCaseDetailDto>(
      `/v1/asc-center/repair-cases/${repairCaseId}`,
    );
  }
  createRepairCase(data: RequestCreateRepairCaseDto) {
    return this.tryPost<
      ResponseRepairCaseDetailDto,
      RequestCreateRepairCaseDto
    >("/v1/asc-center/repair-cases", data);
  }
  updateRepairCase(repairCaseId: string, data: RequestUpdateRepairCaseDto) {
    return this.tryPatch<
      ResponseRepairCaseDetailDto,
      RequestUpdateRepairCaseDto
    >(`/v1/asc-center/repair-cases/${repairCaseId}`, data);
  }
  deleteRepairCase(repairCaseId: string) {
    return this.tryDelete<BaseApiResponse<{ success: boolean }>>(
      `/v1/asc-center/repair-cases/${repairCaseId}`,
    );
  }
  exportExcel() {
    return this.tryGet<Blob>("/v1/asc-center/repair-cases/export", {
      responseType: "blob",
    });
  }
  listImages(repairCaseId: string) {
    return this.tryGet<BaseApiResponse<RepairCaseImageDto[]>>(
      `/v1/asc-center/repair-cases/${repairCaseId}/images`,
    );
  }
  uploadImages(
    repairCaseId: string,
    images: File[],
    imageType: RepairCaseImageType,
    description?: string,
  ) {
    const formData = new FormData();
    images.forEach(img => formData.append("files", img));
    formData.append("imageType", imageType);
    if (description) formData.append("description", description);
    return this.tryPost<BaseApiResponse<RepairCaseImageDto[]>, FormData>(
      `/v1/asc-center/repair-cases/${repairCaseId}/images`,
      formData,
    );
  }
  deleteImage(repairCaseId: string, imageId: string) {
    return this.tryDelete<BaseApiResponse<{ success: boolean }>>(
      `/v1/asc-center/repair-cases/${repairCaseId}/images/${imageId}`,
    );
  }
}

export const repairCaseAPI = new RepairCaseAPI();
