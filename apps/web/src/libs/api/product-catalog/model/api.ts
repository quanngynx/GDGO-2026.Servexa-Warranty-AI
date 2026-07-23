import { BaseApi } from "@/libs/axios";
import type {
  ModelApiResponse,
  RequestCreateModelDto,
  RequestListModelsDto,
  RequestUpdateModelDto,
  ResponseExportJobDto,
  ResponseModelDto,
  ResponseModelListDto,
} from "./data-transfer-object";

class ModelAPI extends BaseApi {
  findAll(params?: RequestListModelsDto) {
    return this.tryGet<ModelApiResponse<ResponseModelListDto>>(
      "/v1/product-catalog/models",
      {
        params,
      },
    );
  }

  findOneById(modelId: string) {
    return this.tryGet<ModelApiResponse<ResponseModelDto>>(
      `/v1/product-catalog/models/${modelId}`,
    );
  }

  triggerExportModel() {
    return this.tryPost<
      ModelApiResponse<ResponseExportJobDto>,
      Record<string, never>
    >("/v1/product-catalog/models/exports", {});
  }

  listExportModels() {
    return this.tryGet<ModelApiResponse<ResponseExportJobDto[]>>(
      "/v1/product-catalog/models/exports",
    );
  }

  getExportModel(jobId: string) {
    return this.tryGet<ModelApiResponse<ResponseExportJobDto>>(
      `/v1/product-catalog/models/exports/${jobId}`,
      { headers: { 'Cache-Control': 'no-cache' } },
    );
  }

  cancelExportModel(jobId: string) {
    return this.tryPost<
      ModelApiResponse<ResponseExportJobDto>,
      Record<string, never>
    >(`/v1/product-catalog/models/exports/${jobId}/cancel`, {});
  }

  downloadImportTemplate() {
    return this.tryGet<Blob>("/v1/product-catalog/models/import-template", {
      responseType: "blob",
    });
  }

  importModel(data: FormData) {
    return this.tryPost<ModelApiResponse<{ success: boolean }>, FormData>(
      "/v1/product-catalog/models/import",
      data,
    );
  }

  createModel(data: RequestCreateModelDto) {
    return this.tryPost<
      ModelApiResponse<ResponseModelDto>,
      RequestCreateModelDto
    >("/v1/product-catalog/models", data);
  }

  updateModel(modelId: string, data: RequestUpdateModelDto) {
    return this.tryPatch<
      ModelApiResponse<ResponseModelDto>,
      RequestUpdateModelDto
    >(`/v1/product-catalog/models/${modelId}`, data);
  }

  deleteModel(modelId: string) {
    return this.tryDelete<ModelApiResponse<{ success: boolean }>>(
      `/v1/product-catalog/models/${modelId}`,
    );
  }

  restoreModel(modelId: string) {
    return this.tryPatch<ModelApiResponse<{ success: boolean }>>(
      `/v1/product-catalog/models/${modelId}/restore`,
      {},
    );
  }
}

export const modelAPI = new ModelAPI();
