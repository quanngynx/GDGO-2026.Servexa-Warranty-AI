export interface Session {
  refreshToken: string;
  userAgent: string;
  ipAddress: string;
  deviceInfo: DeviceInfo;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
}

export interface DeviceInfo {
  deviceName: string;
  deviceType: string;
  os: string;
  browser: string;
  ipAddress: string;
}
