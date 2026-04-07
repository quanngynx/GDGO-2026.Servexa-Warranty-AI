import { BaseApi } from "@/libs/axios";
import type { RequestLoginDto, ResponseLoginDto } from "./data-transfer-object";

class AuthAPI extends BaseApi {
  constructor() {
    super();
  }

  async login(
    username: string,
    password: string
  ): Promise<ResponseLoginDto | null> {
    const response = await this.tryPost<ResponseLoginDto, RequestLoginDto>(
      "/auth/login",
      { username, password }
    );
    return response;
  }
}

export const authAPI = new AuthAPI();
