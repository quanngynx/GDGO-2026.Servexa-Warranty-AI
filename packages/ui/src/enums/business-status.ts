export enum UserStatus {
  active = "active",
  inactive = "inactive",
  suspended = "suspended",
}

export enum RepairingStatus {
  moiNhan = "1",
  daDieuPhoi = "2",
  suaXong = "3",
  baoGia = "4",
  traLai = "5",
  daGiaoChoKhach = "6",
  choXacNhanChuyenChoKhach = "7",
  chuaXacDinh = "8",
}

export enum TinhTrangBDStatus {
  chuaXacDinh = "8",
}

export enum WarrantyType {
  KHACH_MANG_TOI_TTBH = "1",
  SUA_CHUA_TAI_NHA_KHACH_HANG = "2",
  NHAN_TU_NHA_VAN_CHUYEN = "3",
  NHAN_TU_CUA_HANG = "4",
  SUA_CHUA_KHO_HOAC_CUA_HANG = "5",
  CHUA_XAC_DINH = "6",
}
