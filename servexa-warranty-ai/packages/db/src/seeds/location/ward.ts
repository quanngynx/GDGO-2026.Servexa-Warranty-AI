import prisma from "../..";

export async function seedWards() {
  console.log("🗺️ Creating Vietnam geographic data...");
  const provinces = await Promise.all([
    // Northern Vietnam
    prisma.province.upsert({
      where: { code: "HN" },
      update: {},
      create: { name: "Hà Nội", code: "HN" },
    }),
    prisma.province.upsert({
      where: { code: "HP" },
      update: {},
      create: { name: "Hải Phòng", code: "HP" },
    }),
    prisma.province.upsert({
      where: { code: "TQ" },
      update: {},
      create: { name: "Tuyên Quang", code: "TQ" },
    }),
    prisma.province.upsert({
      where: { code: "LCA" },
      update: {},
      create: { name: "Lào Cai", code: "LCA" },
    }),
    prisma.province.upsert({
      where: { code: "LC" },
      update: {},
      create: { name: "Lai Châu", code: "LC" },
    }),
    prisma.province.upsert({
      where: { code: "DB" },
      update: {},
      create: { name: "Điện Biên", code: "DB" },
    }),
    prisma.province.upsert({
      where: { code: "LS" },
      update: {},
      create: { name: "Lạng Sơn", code: "LS" },
    }),
    prisma.province.upsert({
      where: { code: "CB" },
      update: {},
      create: { name: "Cao Bằng", code: "CB" },
    }),
    prisma.province.upsert({
      where: { code: "SL" },
      update: {},
      create: { name: "Sơn La", code: "SL" },
    }),
    prisma.province.upsert({
      where: { code: "TNG" },
      update: {},
      create: { name: "Thái Nguyên", code: "TNG" },
    }),
    prisma.province.upsert({
      where: { code: "PT" },
      update: {},
      create: { name: "Phú Thọ", code: "PT" },
    }),
    prisma.province.upsert({
      where: { code: "QN" },
      update: {},
      create: { name: "Quảng Ninh", code: "QN" },
    }),
    prisma.province.upsert({
      where: { code: "BNI" },
      update: {},
      create: { name: "Bắc Ninh", code: "BNI" },
    }),
    prisma.province.upsert({
      where: { code: "HY" },
      update: {},
      create: { name: "Hưng Yên", code: "HY" },
    }),
    prisma.province.upsert({
      where: { code: "NB" },
      update: {},
      create: { name: "Ninh Bình", code: "NB" },
    }),

    // Central Vietnam
    prisma.province.upsert({
      where: { code: "TH" },
      update: {},
      create: { name: "Thanh Hóa", code: "TH" },
    }),
    prisma.province.upsert({
      where: { code: "NA" },
      update: {},
      create: { name: "Nghệ An", code: "NA" },
    }),
    prisma.province.upsert({
      where: { code: "HT" },
      update: {},
      create: { name: "Hà Tĩnh", code: "HT" },
    }),
    prisma.province.upsert({
      where: { code: "QT" },
      update: {},
      create: { name: "Quảng Trị", code: "QT" },
    }),
    prisma.province.upsert({
      where: { code: "TTH" },
      update: {},
      create: { name: "Thừa Thiên Huế", code: "TTH" },
    }),
    prisma.province.upsert({
      where: { code: "DN" },
      update: {},
      create: { name: "Thành phố Đà Nẵng", code: "DN" },
    }),
    prisma.province.upsert({
      where: { code: "QNG" },
      update: {},
      create: { name: "Quảng Ngãi", code: "QNG" },
    }),
    prisma.province.upsert({
      where: { code: "GL" },
      update: {},
      create: { name: "Gia Lai", code: "GL" },
    }),
    prisma.province.upsert({
      where: { code: "KH" },
      update: {},
      create: { name: "Khánh Hòa", code: "KH" },
    }),
    prisma.province.upsert({
      where: { code: "DL" },
      update: {},
      create: { name: "Đắk Lắk", code: "DL" },
    }),
    prisma.province.upsert({
      where: { code: "LD" },
      update: {},
      create: { name: "Lâm Đồng", code: "LD" },
    }),
    // Southern Vietnam
    prisma.province.upsert({
      where: { code: "HCM" },
      update: {},
      create: { name: "Hồ Chí Minh", code: "HCM" },
    }),
    prisma.province.upsert({
      where: { code: "DNA" },
      update: {},
      create: { name: "Đồng Nai", code: "DNA" },
    }),
    prisma.province.upsert({
      where: { code: "TN" },
      update: {},
      create: { name: "Tây Ninh", code: "TN" },
    }),
    prisma.province.upsert({
      where: { code: "CT" },
      update: {},
      create: { name: "Cần Thơ", code: "CT" },
    }),
    prisma.province.upsert({
      where: { code: "VL" },
      update: {},
      create: { name: "Vĩnh Long", code: "VL" },
    }),
    prisma.province.upsert({
      where: { code: "DT" },
      update: {},
      create: { name: "Đồng Tháp", code: "DT" },
    }),
    prisma.province.upsert({
      where: { code: "CM" },
      update: {},
      create: { name: "Cà Mau", code: "CM" },
    }),
    prisma.province.upsert({
      where: { code: "AG" },
      update: {},
      create: { name: "An Giang", code: "AG" },
    }),
  ]);
  console.log(`✅ Created ${provinces.length} provinces`);

  // Create wards for major provinces
  console.log("🗺️ Creating Vietnam geographic data...");

  //northern provinces
  const hanoiProvince = provinces.find((p) => p.code === "HN")!;
  const hpProvince = provinces.find((p) => p.code === "HP")!;
  const tqProvince = provinces.find((p) => p.code === "TQ")!;
  const lcaProvince = provinces.find((p) => p.code === "LCA")!;
  const lcProvince = provinces.find((p) => p.code === "LC")!;
  const dbProvince = provinces.find((p) => p.code === "DB")!;
  const lsProvince = provinces.find((p) => p.code === "LS")!;
  const cbProvince = provinces.find((p) => p.code === "CB")!;
  const slProvince = provinces.find((p) => p.code === "SL")!;
  const tngProvince = provinces.find((p) => p.code === "TNG")!;
  const ptProvince = provinces.find((p) => p.code === "PT")!;
  const qnProvince = provinces.find((p) => p.code === "QN")!;
  const bniProvince = provinces.find((p) => p.code === "BNI")!;
  const hyProvince = provinces.find((p) => p.code === "HY")!;
  const nbProvince = provinces.find((p) => p.code === "NB")!;
  //central provinces
  const thProvince = provinces.find((p) => p.code === "TH")!;
  const naProvince = provinces.find((p) => p.code === "NA")!;
  const htProvince = provinces.find((p) => p.code === "HT")!;
  const qtProvince = provinces.find((p) => p.code === "QT")!;
  const tthProvince = provinces.find((p) => p.code === "TTH")!;
  const dnProvince = provinces.find((p) => p.code === "DN")!;
  const qngProvince = provinces.find((p) => p.code === "QNG")!;
  const glProvince = provinces.find((p) => p.code === "GL")!;
  const khProvince = provinces.find((p) => p.code === "KH")!;
  const dlProvince = provinces.find((p) => p.code === "DL")!;
  const ldProvince = provinces.find((p) => p.code === "LD")!;
  //southern provinces
  const hcmProvince = provinces.find((p) => p.code === "HCM")!;
  const agProvince = provinces.find((p) => p.code === "AG")!;
  const ctProvince = provinces.find((p) => p.code === "CT")!;
  const dtProvince = provinces.find((p) => p.code === "DT")!;
  const cmProvince = provinces.find((p) => p.code === "CM")!;
  const vlProvince = provinces.find((p) => p.code === "VL")!;
  const tnProvince = provinces.find((p) => p.code === "TN")!;
  const dnaProvince = provinces.find((p) => p.code === "DNA")!;

  await Promise.all([
    prisma.ward.create({
      data: {
        name: "An Biên",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Châu",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Cư",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Minh",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phú",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Chúc",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình An",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Đức",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Giang",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Hòa",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Mỹ",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Sơn",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thạnh Đông",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cần Đăng",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Đốc",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Phong",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Phú",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Thành",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chi Lăng",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chợ Mới",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chợ Vàm",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cô Tô",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cù Lao Giêng",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Định Hòa",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Định Mỹ",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hòa",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hưng",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thái",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giang Thành",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giồng Riềng",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gò Quao",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Tiên",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Điền",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Hưng",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Lạc",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Thuận",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòn Đất",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòn Nghệ",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hội An",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Bình",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiên Hải",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiên Lương",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Điền",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Kiến",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Phú",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Thạnh",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Xuyên",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Đức",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Hòa Hưng",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thới",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thuận",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Chúc",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhơn Hội",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhơn Mỹ",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Núi Cấm",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Óc Eo",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ô Lâm",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú An",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Hòa",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Hữu",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lâm",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Quốc",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Tân",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Rạch Giá",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Hải",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Kiên",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Châu",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hiệp",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hội",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thạnh",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Phú",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Yên",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Đông",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Hưng",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Lộc",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Mỹ Tây",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thoại Sơn",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thổ Châu",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới Sơn",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hanh",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hậu",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hòa",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hòa Hưng",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Phong",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Tế",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thạnh Trung",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thông",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thuận",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Trạch",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Tuy",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Xương",
        provinceId: agProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Lạc",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Đài",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Giang",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Lũng",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Biển Động",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Biên Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bố Hạ",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bồng Lai",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cảnh Thụy",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Đức",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Lý",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chi Lăng",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chũ",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dương Hưu",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đa Mai",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Đồng",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Lai",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đào Viên",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đèo Gia",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Cứu",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Kỳ",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Nguyên",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Phú",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Việt",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Bình",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạp Lĩnh",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Hòa",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Vân",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hợp Thịnh",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kép",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiên Lao",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kinh Bắc",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lạng Giang",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lâm Thao",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Bão",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lục Nam",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lục Ngạn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lục Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Tài",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mão Điền",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thái",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Dương",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nếnh",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Phương",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Thiện",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhã Nam",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhân Hòa",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhân Thắng",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Xá",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phật Tích",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Khê",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Lãng",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Hoà",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phương Liễu",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phượng Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Trung",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quế Võ",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sa Lý",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Song Liễu",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Động",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Hải",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Đa",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Giang",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Tiến",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Chi",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Dĩnh",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tiến",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Yên",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Yên Tử",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Thành",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Du",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Lục",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiền Phong",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trạm Lộ",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trí Quả",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Chính",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Kênh",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuấn Đạo",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tự Lạn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Từ Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Môn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Hà",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Sơn",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Yên",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Võ Cường",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũ Ninh",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Cẩm",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lương",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Dũng",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Định",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Phong",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thế",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Trung",
        provinceId: bniProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Trạch",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Xuyên",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạc Liêu",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Biển Bạch",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cái Đôi Vàm",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cái Nước",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Thới",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đá Bạc",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đầm Dơi",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đất Mới",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đất Mũi",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Định Thành",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hải",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gành Hào",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giá Rai",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Thành",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoà Bình",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoà Thành",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồ Thị Kỷ",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Dân",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Hội",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Mỹ",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh An",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Bình",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Hưng",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Lâm",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Láng Tròn",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Điền",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Thế Trân",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lý Văn Lâm",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Năm Căn",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Phích",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Việt Khái",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Quới",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Thạnh Lợi",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phan Ngọc Hiển",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Hiệp",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Thạnh",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Mỹ",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Tân",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Long",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quách Phẩm",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Đốc",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tạ An Khương",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Giang",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Ân",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hưng",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lộc",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thuận",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tiến",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Tùng",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới Bình",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Phán",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Văn Thời",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trí Phải",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "U Minh",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hậu",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Lộc",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Lợi",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Mỹ",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Phước",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thanh",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Trạch",
        provinceId: cmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Đằng",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Lạc",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Lâm",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bế Văn Đàn",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ca Thành",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Canh Tân",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cần Yên",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cô Ba",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cốc Pàng",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đàm Thủy",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đình Phong",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đoài Dương",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Độc Lập",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Khê",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Long",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạ Lang",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Quảng",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạnh Phúc",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa An",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Huy Giáp",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Đạo",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Xuân",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Đồng",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lũng Nặm",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lý Bôn",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lý Quốc",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Khai",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Tâm",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Quang",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Tuấn",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyên Bình",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Huệ",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nùng Trí Cao",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phan Thanh",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phục Hòa",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Hán",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Lâm",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Long",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Trung",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Uyên",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Lộ",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Kim",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Giang",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch An",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Công",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Long",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thông Nông",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thục Phán",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tĩnh Túc",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tổng Cọt",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Lĩnh",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trùng Khánh",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Hà",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vinh Quý",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Trường",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thổ",
        provinceId: cbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Bình",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Lạc Thôn",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Ninh",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Thạnh",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thủy",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cái Khế",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cái Răng",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Thành",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cờ Đỏ",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cù Lao Dung",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Hải",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Ngãi",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Thành",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hiệp",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Phước",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thuận",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Hòa",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Hưng",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa An",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hỏa Lựu",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Tú",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồ Đắc Kiện",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Phú",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kế Sách",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Hòa",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lai Hòa",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lâm Tân",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lịch Hội Thượng",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liêu Tú",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Bình",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hưng",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Mỹ",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Phú",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Phú 1",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Tuyền",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Tâm",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Hương",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Phước",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Quới",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Tú",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Xuyên",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngã Bảy",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngã Năm",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Tố",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhơn Ái",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhơn Mỹ",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhu Gia",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Kiều",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ô Môn",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Điền",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Nẫm",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Hữu",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lộc",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lợi",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Tâm",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phụng Hiệp",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Thới",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phương Bình",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sóc Trăng",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tài Văn",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Bình",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hòa",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Long",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lộc",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phước Hưng",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thạnh",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh An",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Hòa",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Phú",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Quới",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Thới An",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Xuân",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thốt Nốt",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới An Đông",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới An Hội",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới Hưng",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới Lai",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới Long",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Hòa",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Hưng",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Đề",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Hưng",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Nhứt",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Khánh",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Long",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Long Tây",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Thành",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Xuân",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vị Tân",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vị Thanh",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vị Thanh 1",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vị Thủy",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Châu",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hải",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Lợi",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Phước",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thạnh",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thuận Đông",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Trinh",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Tường",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Viễn",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xà Phiên",
        provinceId: ctProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hải",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Khê",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Thắng",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Avương",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bà Nà",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bàn Thạch",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bến Giằng",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bến Hiên",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Lệ",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiên Đàn",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Duy Nghĩa",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Duy Xuyên",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Lộc",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đắc Pring",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điện Bàn",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điện Bàn Bắc",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điện Bàn Đông",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điện Bàn Tây",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Dương",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Giang",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Phú",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gò Nổi",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Nha",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Châu",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Vân",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Đức",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Cường",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Khánh",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Tiến",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Vang",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Xuân",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Sa",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hội An",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hội An Đông",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hội An Tây",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hùng Sơn",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Trà",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khâm Đức",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "La Dêê",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "La Êê",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lãnh Ngọc",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Chiểu",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Giang",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Phước",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Trà My",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngũ Hành Sơn",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nông Sơn",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Núi Thành",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Ninh",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thuận",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Chánh",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Hiệp",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Năng",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Thành",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Trà",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Phú",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quế Phước",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quế Sơn",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quế Sơn Trung",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Kôn",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Vàng",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Cẩm Hà",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Trà",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Anh",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Hải",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Kỳ",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Mỹ",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Xuân",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hiệp",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Giang",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Hồ",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Bình",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Khê",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Mỹ",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thăng An",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thăng Bình",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thăng Điền",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thăng Phú",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thăng Trường",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thu Bồn",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Đức",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Phước",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Đốc",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Giáp",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Leng",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Liên",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Linh",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà My",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Tân",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Tập",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Vân",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt An",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vu Gia",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Phú",
        provinceId: dnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Kiến",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Buôn Đôn",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Buôn Hồ",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Buôn Ma Thuột",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cuôr Đăng",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cư Bao",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cư M’gar",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cư M’ta",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cư Pơng",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cư Prao",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cư Pui",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cư Yang",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dang Kang",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dliê Ya",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dray Bhăng",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dur Kmăl",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đắk Liêng",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đắk Phơi",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hòa",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Xuân",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Bình",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Bá",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Bung",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Drăng",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Drông",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea H’Leo",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Hiao",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Kao",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Kar",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Khăl",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Kiết",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Kly",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Knốp",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Knuếc",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Ktur",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Ly",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea M’Droh",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Na",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Ning",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Nuôl",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Ô",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Păl",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Phê",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Riêng",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Rốk",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Súp",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Trang",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Tul",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Wer",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ea Wy",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Hiệp",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Mỹ",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Phú",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Sơn",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Thịnh",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Xuân",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Lốp",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Rvê",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Krông Á",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Krông Ana",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Krông Bông",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Krông Búk",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Krông Năng",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Krông Nô",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Krông Pắc",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Sơn Lắk",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "M’Drắk",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Ka",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ô Loan",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Hòa 1",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Hòa 2",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Mỡ",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Xuân",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Yên",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pơng Drang",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Phú",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Cầu",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Hinh",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Hòa",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Thành",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Suối Trai",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Giang",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lập",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tiến",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Hòa",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Sơn",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Nhất",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy An Bắc",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy An Đông",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy An Nam",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy An Tây",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy Hòa",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Hòa",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vụ Bổn",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Cảnh",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Đài",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lãnh",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lộc",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Phước",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Thọ",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yang Mao",
        provinceId: dlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Búng Lao",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chà Tở",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Sinh",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điện Biên Phủ",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Ảng",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Chà",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Lạn",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Lay",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Luân",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Mùn",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Nhà",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Nhé",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Phăng",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Pồn",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Thanh",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Toong",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Tùng",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nà Bủng",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nà Hỳ",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Na Sang",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Na Son",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nà Tấu",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Kè",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Nèn",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Núa Ngam",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pa Ham",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phình Giàng",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pu Nhi",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pú Nhung",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quài Tở",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Lâm",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sam Mứn",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sáng Nhè",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Si Pa Phìn",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sín Chải",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sín Thầu",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sính Phình",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh An",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Nưa",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Yên",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tìa Dình",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tủa Chùa",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tủa Thàng",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuần Giáo",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xa Dung",
        provinceId: dbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Lộc",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phước",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Viễn",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Vinh",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bàu Hàm",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Biên Hòa",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình An",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Long",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Lộc",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Minh",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Phước",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Tân",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bom Bo",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bù Đăng",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bù Gia Mập",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Mỹ",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chơn Thành",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dầu Giây",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đa Kia",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Phước",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đak Lua",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đak Nhau",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Ơ",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Định Quán",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Phú",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Tâm",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Xoài",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Kiệm",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàng Gòn",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hố Nai",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Phước",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Thịnh",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "La Ngà",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Bình",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hà",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hưng",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Khánh",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Phước",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Thành",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Hưng",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Ninh",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Quang",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Tấn",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Thành",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Thạnh",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Đức",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Hưng",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Cát Tiên",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Trung",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nha Bích",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhơn Trạch",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Hòa",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lâm",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lý",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Nghĩa",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Riềng",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Trung",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Vinh",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước An",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Bình",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Long",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Sơn",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Tân",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Thái",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Ray",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tà Lài",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Hiệp",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Phước",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hưng",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Khai",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lợi",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phú",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Quan",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tiến",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Triều",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Sơn",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiện Hưng",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thọ Sơn",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thống Nhất",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Lợi",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trảng Bom",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trảng Dài",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trấn Biên",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trị An",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Bắc",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Định",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Đông",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Đường",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Hòa",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lập",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lộc",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Phú",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Quế",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Thành",
        provinceId: dnaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Bình",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hòa",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hữu",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Long",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phước",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Thạnh Thủy",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Sao",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Hàng Trung",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Ninh",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Phú",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thành",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Trưng",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Xuân",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cái Bè",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cai Lậy",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Lãnh",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Thành",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chợ Gạo",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đạo Thạnh",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đốc Binh Kiều",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Sơn",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Thuận",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gò Công",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gò Công Đông",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hậu Mỹ",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Đức",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Long",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hội Cư",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Ngự",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Thạnh",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Sơn",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lai Vung",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lấp Vò",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Bình",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Định",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hưng",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Khánh",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Phú Thuận",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Thuận",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Tiên",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Hòa Lạc",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ An Hưng",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Đức Tây",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Hiệp",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Lợi",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Ngãi",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Phong",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Phước Tây",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Quí",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thành",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thiện",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Tho",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thọ",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Tịnh An",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Trà",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngũ Hiệp",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhị Quý",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Hòa",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Mỹ",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Cường",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Hựu",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thành",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thọ",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phương Thịnh",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sa Đéc",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Qui",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Nông",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Dương",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Điền",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Đông",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hòa",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hộ Cơ",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hồng",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hương",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Khánh Trung",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Long",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Nhuận Đông",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phú",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phú Đông",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phú Trung",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phước 1",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phước 2",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phước 3",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thạnh",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thới",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thuận Bình",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Bình",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Hòa",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Hưng",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Mỹ",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Phú",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tháp Mười",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới Sơn",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thường Lạc",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thường Phước",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tràm Chim",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung An",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Xuân",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Bình",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hựu",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Kim",
        provinceId: dtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Al Bá",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Bình",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hòa",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Khê",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Lão",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Lương",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Nhơn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Nhơn Bắc",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Nhơn Đông",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Nhơn Nam",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Nhơn Tây",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phú",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Toàn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Vinh",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ayun",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ayun Pa",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ân Hảo",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ân Tường",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bàu Cạn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Biển Hồ",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình An",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Dương",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Định",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Hiệp",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Khê",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Phú",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bồng Sơn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bờ Ngoong",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Canh Liên",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Canh Vinh",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cát Tiến",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chơ Long",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chư A Thai",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chư Krey",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chư Păh",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chư Prông",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chư Pưh",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chư Sê",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cửu An",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diên Hồng",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đak Đoa",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đak Pơ",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đak Rong",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đak Sơmei",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Song",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đề Gi",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Cơ",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gào",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Hội",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoài Ân",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoài Nhơn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoài Nhơn Bắc",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoài Nhơn Đông",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoài Nhơn Nam",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoài Nhơn Tây",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hội Phú",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hội Sơn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hra",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Băng",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Boòng",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Chia",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Dom",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Dơk",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Dreh",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Grai",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Hiao",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Hrú",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Hrung",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Khươl",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Ko",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Krái",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Krêl",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Lâu",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Le",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Ly",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Mơ",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Nan",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia O",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Pa",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Phí",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Pia",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Pnôn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Púch",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Rbol",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Rsai",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Sao",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Tôr",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Tul",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kbang",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "KDang",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Sơn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kon Chiêng",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kon Gang",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kông Bơ La",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kông Chro",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Krong",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lơ Pang",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mang Yang",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngô Mây",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhơn Châu",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Cát",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Mỹ",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Mỹ Bắc",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Mỹ Đông",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Mỹ Nam",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Mỹ Tây",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thiện",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Túc",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pleiku",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pờ Tó",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quy Nhơn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quy Nhơn Bắc",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quy Nhơn Đông",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quy Nhơn Nam",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quy Nhơn Tây",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Lang",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "SRó",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Quan",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Sơn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thống Nhất",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tơ Tung",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy Phước",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy Phước Bắc",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy Phước Đông",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy Phước Tây",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Uar",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Đức",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Canh",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Quang",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Sơn",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thạnh",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thịnh",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân An",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ya Hội",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ya Ma",
        provinceId: glProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Khánh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Đình",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Vì",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Mai",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bát Tràng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bất Bạt",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Minh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bồ Đề",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cầu Giấy",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chuyên Mỹ",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chương Dương",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chương Mỹ",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cổ Đô",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cửa Nam",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dân Hòa",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dương Hòa",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dương Nội",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đa Phúc",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Mỗ",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Thanh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Xuyên",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đan Phượng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Định Công",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đoài Phương",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Anh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đống Đa",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Ngạc",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Lâm",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giảng Võ",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạ Bằng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Đông",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hai Bà Trưng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hát Môn",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Lạc",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Phú",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Xá",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoài Đức",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàn Kiếm",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Liệt",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Mai",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Hà",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Sơn",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Vân",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Đạo",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Sơn",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khương Đình",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến Hưng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiều Phú",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Anh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Liên",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Láng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Minh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lĩnh Nam",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Biên",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mê Linh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Châu",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Đức",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Phù",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Đô",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Hà",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Hồi",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nội Bài",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ô Chợ Dừa",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ô Diên",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Cát",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Diễn",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Đổng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lương",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Nghĩa",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thượng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Xuyên",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Lộc",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Lợi",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Sơn",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Thịnh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Thọ",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phượng Dực",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phương Liệt",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Bị",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Minh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Oai",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quốc Oai",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sóc Sơn",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Đồng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Tây",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Suối Hai",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Hưng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Hồ",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Mỗ",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Phương",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Tựu",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch Thất",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Liệt",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Oai",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Trì",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Xuân",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiên Lộc",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận An",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thư Lâm",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Cát",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Phúc",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thường Tín",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiến Thắng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Phú",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Giã",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tùng Thiện",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Từ Liêm",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tương Mai",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ứng Hòa",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ứng Thiên",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Miếu - Quốc Tử Giám",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Đình",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vật Lại",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Hưng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hưng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thanh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Tuy",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Đỉnh",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Mai",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Phương",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Bài",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Hòa",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Lãng",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Nghĩa",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Sở",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Xuân",
        provinceId: hanoiProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Hồng Lĩnh",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Can Lộc",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Bình",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Duệ",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Hưng",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Lạc",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Trung",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Xuyên",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cổ Đạm",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đan Hải",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Kinh",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Lộc",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Tiến",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Đồng",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Minh",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Quang",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Thịnh",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Thọ",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Hanh",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Huy Tập",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Linh",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Ninh",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoành Sơn",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Lộc",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Bình",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Đô",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Khê",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Phố",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Sơn",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Xuân",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Hoa",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Anh",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Hoa",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Khang",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Lạc",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Thượng",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Văn",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Xuân",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Hà",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mai Hoa",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mai Phụ",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Hồng Lĩnh",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghi Xuân",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Trạch",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Trí",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Giang",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Hồng",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Kim 1",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Kim 2",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Tây",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Tiến",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch Hà",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch Khê",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch Lạc",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch Xuân",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Sen",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiên Cầm",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Đức",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Điền",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Toàn Lưu",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Phú",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Lưu",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tùng Lộc",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tứ Mỹ",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Xuyên",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũ Quang",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũng Áng",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lộc",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Hòa",
        provinceId: htProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ái Quốc",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Biên",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Dương",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hải",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hưng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Khánh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Lão",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phong",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phú",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Quang",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Thành",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Trường",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Đằng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Long Vĩ",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc An Phụ",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Thanh Miện",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Giang",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cát Hải",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Giang",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Giàng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chấn Hưng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chí Linh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chí Minh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chu Văn An",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dương Kinh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Sơn",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồ Sơn",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hải",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đường An",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Lộc",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Phúc",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Viên",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Bắc",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Đông",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Nam",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Tây",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải An",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Dương",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Hưng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Bình",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng An",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Bàng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Châu",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hợp Tiến",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hùng Thắng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Đạo",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kẻ Sặt",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khúc Thừa Dụ",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến An",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến Hải",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến Hưng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến Minh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến Thụy",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Thành",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kinh Môn",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lạc Phượng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lai Khê",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lê Chân",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lê Đại Hành",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lê Ích Mộc",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lê Thanh Nghị",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lưu Kiếm",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mao Điền",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam An Phụ",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Đồ Sơn",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Đồng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Sách",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Thanh Miện",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Triệu",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghi Dương",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngô Quyền",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Bỉnh Khiêm",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Đại Năng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyên Giáp",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Lương Bằng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Trãi",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhị Chiểu",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Giang",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phạm Sư Mạnh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Liễn",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thái",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quyết Thắng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hưng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Kỳ",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Minh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch Khôi",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Tân",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Đông",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Hà",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Miện",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiên Hương",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thủy Nguyên",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Hồng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Lãng",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Minh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Hưng Đạo",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Liễu",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Nhân Tông",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Phú",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Tân",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuệ Tĩnh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tứ Kỳ",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tứ Minh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Hòa",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Khê",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Am",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Bảo",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hải",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hòa",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Lại",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thịnh",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thuận",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yết Kiêu",
        provinceId: hpProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "A Lưới 1",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "A Lưới 2",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "A Lưới 3",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "A Lưới 4",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "A Lưới 5",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Cựu",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Điền",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chân Mây - Lăng Cô",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dương Nỗ",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đan Điền",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hóa Châu",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Lộc",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương An",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Thủy",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Trà",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khe Tre",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Long",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Trà",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Quảng",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc An",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thượng",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Đông",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Dinh",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Điền",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Phú",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Quảng",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Thái",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Bài",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Hồ",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lộc",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Vang",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Vinh",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Xuân",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Điền",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Thủy",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận An",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Hóa",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thủy Xuân",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vinh Lộc",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vỹ Dạ",
        provinceId: tthProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "A Sào",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ái Quốc",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ân Thi",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Đông Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Đông Quan",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Thái Ninh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Thụy Anh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Tiên Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Định",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Nguyên",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thanh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Ninh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chí Minh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diên Hà",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Đồng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đoàn Đào",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Bằng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Châu",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Quan",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thái Ninh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thụy Anh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Tiền Hải",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Tiên Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Hợp",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đường Hào",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Cường",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàn Long",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Hoa Thám",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Châu",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Minh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Quang",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Vũ",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Hà",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Phú",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khoái Châu",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến Xương",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lạc Đạo",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lê Lợi",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lê Quý Đôn",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Bằng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mễ Sở",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Thọ",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Hào",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Cường",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Đông Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Thái Ninh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Thụy Anh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Tiền Hải",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Tiên Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Dân",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Trụ",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Lâm",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Du",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Trãi",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Văn Linh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngự Thiên",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Như Quỳnh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phạm Ngũ Lão",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phố Hiến",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phụ Dực",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phụng Công",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Lịch",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh An",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Phụ",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Nam",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thuận",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tiến",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Thái Ninh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Thụy Anh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Tiền Hải",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Bình",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Ninh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Thụy",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thần Khê",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thụy Anh",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thư Trì",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thư Vũ",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Hồng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiền Hải",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Hoa",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Hưng",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên La",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Lữ",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Tiến",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tống Trân",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Giang",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Lý",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Hưng Đạo",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Lãm",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Triệu Việt Vương",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Xuân",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Giang",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Tiến",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Yên",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũ Phúc",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũ Quý",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũ Thư",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũ Tiên",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Trúc",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Mỹ",
        provinceId: hyProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Anh Dũng",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Ngòi",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bác Ái",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bác Ái Đông",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bác Ái Tây",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo An",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Cam Ranh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Khánh Vĩnh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Nha Trang",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Ninh Hòa",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cà Ná",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam An",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam Hiệp",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam Lâm",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam Linh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam Ranh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Công Hải",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diên Điền",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diên Khánh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diên Lạc",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diên Lâm",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diên Thọ",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Lãnh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đô Vinh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hải",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Khánh Sơn",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Ninh Hòa",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Thắng",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Trí",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Sơn",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Vĩnh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lâm Sơn",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Sơn",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Cam Ranh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Khánh Vĩnh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Nha Trang",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Ninh Hòa",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nha Trang",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Chử",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Hải",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Hòa",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Phước",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Sơn",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phan Rang",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Dinh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Hà",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Hậu",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Hữu",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Suối Dầu",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Suối Hiệp",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Định",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Khánh Sơn",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Khánh Vĩnh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Nha Trang",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Ninh Hòa",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Bắc",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Nam",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Khánh Vĩnh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Sa",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tu Bông",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Hưng",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Ninh",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Thắng",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hải",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Hải",
        provinceId: khProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bản Bo",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Lư",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bum Nưa",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bum Tở",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dào San",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đoàn Kết",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Thu",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hua Bum",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khoen On",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khổng Lào",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khun Há",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lê Lợi",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mù Cả",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Khoa",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Kim",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Mô",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Tè",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Than",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Cuổi",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Hàng",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Mạ",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Sỏ",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Tăm",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pa Tần",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pa Ủ",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pắc Ta",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Thổ",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pu Sam Cáp",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sì Lở Lầu",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sìn Hồ",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sin Suối Hồ",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tả Lèng",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tà Tổng",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phong",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Uyên",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Than Uyên",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thu Lũm",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tủa Sín Chải",
        provinceId: lcProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Sơn",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Sơn",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bằng Mạc",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Gia",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cai Kinh",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Lộc",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Sơn",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chi Lăng",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiến Thắng",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Công Sơn",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điềm He",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đình Lập",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đoàn Kết",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Đăng",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Kinh",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoa Thám",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Văn Thụ",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hội Hoan",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Phong",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Vũ",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hữu Liên",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hữu Lũng",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kháng Chiến",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Khê",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khuất Xá",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiên Mộc",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Lừa",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Bình",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lợi Bác",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Văn Tri",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mẫu Sơn",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Na Dương",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Na Sầm",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhân Lý",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhất Hòa",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quan Sơn",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quốc Khánh",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quốc Việt",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quý Hòa",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Thanh",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Đoàn",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tiến",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tri",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Văn",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Bình",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thất Khê",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiện Hòa",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiện Long",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiện Tân",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiện Thuật",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thống Nhất",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thụy Hùng",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tràng Định",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tri Lễ",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuấn Sơn",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Linh",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Lãng",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Quan",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Nham",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũ Lăng",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũ Lễ",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Dương",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Bình",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Phúc",
        provinceId: lsProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "A Mú Sung",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Âu Lâu",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bản Hồ",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bản Lầu",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bản Liền",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bản Xèo",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Ái",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Hà",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Nhai",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Thắng",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Yên",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bát Xát",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Hà",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam Đường",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cảm Nhân",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Sơn",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cát Thịnh",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cầu Thia",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chấn Thịnh",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Quế",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chế Tạo",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Ken",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cốc Lầu",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cốc San",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dền Sáng",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dương Quỳ",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Cuông",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Hội",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Phú",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạnh Phúc",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hợp Thành",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Khánh",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Hòa",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Yên",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khao Mang",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lào Cai",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lao Chải",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lâm Giang",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lâm Thượng",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Sơn",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lục Yên",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lùng Phình",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Thịnh",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mậu A",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Lương",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỏ Vàng",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mù Cang Chải",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Bo",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Hum",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Khương",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Lai",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Cường",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Chày",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Có",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Xé",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Đô",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Lộ",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Tâm",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngũ Chỉ Sơn",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pha Long",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phình Hồ",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Dụ Hạ",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Dụ Thượng",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Hải",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Khánh",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Lợi",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Púng Luông",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quy Mông",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sa Pa",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Si Ma Cai",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sín Chéng",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Lương",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tả Củ Tỷ",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tả Phìn",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tả Van",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tà Xi Láng",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tằng Loỏng",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hợp",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lĩnh",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thác Bà",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Bằng La",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Hà",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trạm Tấu",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trấn Yên",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trịnh Tường",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Tâm",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tú Lệ",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Bàn",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Chấn",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Phú",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Hồng",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Võ Lao",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Ái",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Hòa",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Quang",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Y Tý",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Bái",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Bình",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thành",
        provinceId: lcaProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "1 Bảo Lộc",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "2 Bảo Lộc",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "3 Bảo Lộc",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "B’Lao",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Lâm 1",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Lâm 2",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Lâm 3",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Lâm 4",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Lâm 5",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Thuận",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Bình",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Gia Nghĩa",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Ruộng",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thuận",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam Ly - Đà Lạt",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cát Tiên",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cát Tiên 2",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cát Tiên 3",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cư Jút",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "D’Ran",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Di Linh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đạ Huoai",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đạ Huoai 2",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đạ Huoai 3",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đạ Tẻh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đạ Tẻh 2",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đạ Tẻh 3",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đam Rông 1",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đam Rông 2",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đam Rông 3",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đam Rông 4",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đắk Mil",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đắk Sắk",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đắk Song",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đắk Wil",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đinh Trang Thượng",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đinh Văn Lâm Hà",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Gia Nghĩa",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Giang",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Kho",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đơn Dương",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức An",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Lập",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Linh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Trọng",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Hiệp",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Ninh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Kiệm",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Liêm",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Tân",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Thạnh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Thắng",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Thuận",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Thuận Bắc",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Thuận Nam",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Thạnh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Bắc",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Ninh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Thắng",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoài Đức",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Sơn",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Thái",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ka Đô",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến Đức",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Krông Nô",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "La Dạ",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "La Gi",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lạc Dương",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lang Biang - Đà Lạt",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lâm Viên - Đà Lạt",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Hương",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Sơn",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mũi Né",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Ban Lâm Hà",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Dong",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Đà",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Gia Nghĩa",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Hà Lâm Hà",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Thành",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nâm Nung",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghị Đức",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhân Cơ",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Gia",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phan Rí Cửa",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phan Sơn",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phan Thiết",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Quý",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Sơn Lâm Hà",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thủy",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Thọ Lâm Hà",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Hội",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Hòa",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Khê",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Lập",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Phú",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Sơn",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Tân",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Tín",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Trực",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Lũy",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Điền",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Mỹ",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Suối Kiết",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tà Đùng",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tà Hine",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tà Năng",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tánh Linh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hà Lâm Hà",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hải",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hội",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lập",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Minh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận An",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Hạnh",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiến Thành",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Tân",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Xuân",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy Đức",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuy Phong",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuyên Quang",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hảo",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Hương - Đà Lạt",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Trường - Đà Lạt",
        provinceId: ldProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Châu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Anh Sơn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Anh Sơn Đông",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Hà",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Ngọc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Lý",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bích Hào",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Chuẩn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Minh",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam Phục",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cát Ngạn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Bình",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Hồng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Khê",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Lộc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Tiến",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiêu Lưu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Con Cuông",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cửa Lò",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diễn Châu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Đồng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Huệ",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đô Lương",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hiếu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Lộc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thành",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Châu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giai Lạc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giai Xuân",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Châu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Lộc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạnh Lâm",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoa Quân",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Mai",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hợp Minh",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hùng Chân",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hùng Châu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Huồi Tụ",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Nguyên",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Nguyên Nam",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hữu Khuông",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hữu Kiệm",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Keng Đu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Bảng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Liên",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lam Thành",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lượng Minh",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Sơn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mậu Thạch",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Châu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Hợp",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Môn Sơn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Chọng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Ham",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Lống",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Quàng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Típ",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Xén",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Lý",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Na Loi",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Na Ngoi",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Đàn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Cắn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nga My",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghi Lộc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Đàn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Đồng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Hành",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Hưng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Khánh",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Lâm",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Lộc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Mai",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Thọ",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhân Hòa",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhôn Mai",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Lộc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quan Thành",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Châu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Đồng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quế Phong",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳ Châu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳ Hợp",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Anh",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Lưu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Mai",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Phú",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Sơn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Tam",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Thắng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Văn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Lâm",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Đồng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Hợp",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Quang",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Thái",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Châu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Kỳ",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Mai",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phú",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Hiếu",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Hòa",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Bình Thọ",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Vinh",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thần Lĩnh",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiên Nhẫn",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thông Thụ",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuần Trung",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Đồng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiền Phong",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tri Lễ",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Lộc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Vinh",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tương Dương",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn An",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Hiến",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Kiều",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Du",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Tụ",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vinh Hưng",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vinh Lộc",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vinh Phú",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Tường",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lâm",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Hòa",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Na",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thành",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Trung",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Xuân",
        provinceId: naProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Lý",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình An",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Giang",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Lục",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Minh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Mỹ",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Sơn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cát Thành",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chất Bình",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Sơn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cổ Lễ",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cúc Phương",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Duy Hà",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Duy Tân",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Duy Tiên",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Hoàng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Định Hóa",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông A",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hoa Lư",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Thái",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Thịnh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Văn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Hưng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Lâm",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Phong",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Trấn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Tường",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Vân",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Viễn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giao Bình",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giao Hòa",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giao Hưng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giao Minh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giao Ninh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giao Phúc",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giao Thủy",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Nam",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải An",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Anh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Hậu",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Hưng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Quang",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Thịnh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Tiến",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Xuân",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiển Khánh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoa Lư",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Phong",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Quang",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Hội",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Nhạc",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Thiện",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Trung",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Bảng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Đông",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Sơn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Thanh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lai Thành",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lê Hồ",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liêm Hà",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liêm Tuyền",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Minh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lý Nhân",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lý Thường Kiệt",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Tân",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Thái",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Lộc",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Định",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Đồng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Hoa Lư",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Hồng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Lý",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Minh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Ninh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Trực",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Xang",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Hưng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Lâm",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Sơn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Úy",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhân Hà",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nho Quan",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Cường",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Giang",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phát Diệm",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Doanh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Long",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phủ Lý",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Sơn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Vân",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Hưng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Thiện",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỹ Nhất",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Lưu",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Rạng Đông",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Chúc",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Điệp",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Minh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thanh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Hoa Lư",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Bình",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Lâm",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Liêm",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Nam",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Sơn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiên Trường",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Sơn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Thương",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Sơn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trực Ninh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Thi",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Thắng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vị Khê",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Trụ",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vụ Bản",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũ Dương",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Giang",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Hồng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Hưng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Trường",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ý Yên",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Cường",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Đồng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Khánh",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Mạc",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Mô",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Sơn",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thắng",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Từ",
        provinceId: nbProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Bình",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Nghĩa",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Âu Cơ",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bản Nguyên",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bao La",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bằng Luân",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Nguyên",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Phú",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Tuyền",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Xuyên",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Dương",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Phong",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Khê",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chân Mộng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chí Đám",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chí Tiên",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cự Đồng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dân Chủ",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dũng Tiến",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đà Bắc",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Đình",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Đồng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đan Thượng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đạo Trù",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đào Xá",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đoan Hùng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Lương",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thành",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Nhàn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạ Hòa",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Lựu",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiền Lương",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiền Quan",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Bình",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng An",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Cương",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hội Thịnh",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hợp Kim",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hợp Lý",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hùng Việt",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Cần",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hy Cương",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khả Cửu",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Bôi",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lạc Lương",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lạc Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lạc Thủy",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lai Đồng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lâm Thao",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lập Thạch",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Châu",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Hòa",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Minh",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Cốc",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mai Châu",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mai Hạ",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Đài",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Hòa",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Bi",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Động",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Hoa",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Thàng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Vang",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nật Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyệt Đức",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhân Nghĩa",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nông Trang",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pà Cò",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Châu",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Khê",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Mỹ",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Ninh",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thọ",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Yên",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phùng Nguyên",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Yên",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quy Đức",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quyết Thắng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Lô",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Đông",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Lương",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Dương",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Dương Bắc",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Đảo",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Hồng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Nông",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hòa",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lạc",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Mai",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Pheo",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Cốc",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tề Lỗ",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Hòa",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Ba",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Miếu",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Thủy",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thịnh Minh",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thọ Văn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thổ Tang",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thống Nhất",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thu Cúc",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thung Nai",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Cốc",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Long",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Lữ",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Lương",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiền Phong",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Toàn Thắng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trạm Thản",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tu Vũ",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Xuân",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Lang",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Miếu",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Bán",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Phú",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Trì",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh An",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Chân",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hưng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Phú",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Phúc",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thành",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Tường",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Yên",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Võ Miếu",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Đài",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Hòa",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lãng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lũng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Viên",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Kỳ",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Lạc",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Lãng",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Lập",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Phú",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Sơn",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thủy",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Trị",
        provinceId: ptProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phú",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Dinh",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Động",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Gia",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Tô",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Tơ",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Vì",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Vinh",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Xa",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Chương",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Minh",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Sơn",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bờ Y",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cà Đam",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Thành",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dục Nông",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Bla",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Cấm",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Hà",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Kôi",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Long",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Mar",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Môn",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Pék",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Plô",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Pxi",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Rơ Wa",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Rve",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Sao",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Tô",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Tờ Kan",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đăk Ui",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đặng Thùy Trâm",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đình Cương",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Sơn",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Trà Bồng",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Phổ",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Chim",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Đal",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ia Tơi",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Cường",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kon Braih",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kon Đào",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kon Plông",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kon Tum",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lân Phong",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Phụng",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lý Sơn",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Măng Bút",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Măng Đen",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Măng Ri",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Long",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỏ Cày",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mộ Đức",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mô Rai",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Giang",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Hành",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Lộ",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Linh",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọk Bay",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọk Réo",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọk Tụ",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyễn Nghiêm",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Giang",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Rờ Kơi",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sa Bình",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sa Huỳnh",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sa Loong",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sa Thầy",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Hà",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Hạ",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Kỳ",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Linh",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Mai",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Tây",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Tây Hạ",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Tây Thượng",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Thủy",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Tịnh",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Trà",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Trà Bồng",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Bồng",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiện Tín",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thọ Phong",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tịnh Khê",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Bồng",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Câu",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Giang",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Giang",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trương Quang Trọng",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tu Mơ Rông",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tư Nghĩa",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Tường",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vệ Giang",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xốp",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ya Ly",
        provinceId: qngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Sinh",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Chẽ",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bãi Cháy",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Khê",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Liêu",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cái Chiên",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Xanh",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Phả",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cô Tô",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cửa Ông",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đầm Hà",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điền Xá",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Mai",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Ngũ",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Triều",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đường Hoa",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà An",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Lầm",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạ Long",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Tu",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Hòa",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Lạng",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Ninh",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Sơn",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Hòa",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Quế",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoành Bồ",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoành Mô",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Gai",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kỳ Thượng",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Hòa",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lục Hồn",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Minh",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mạo Khê",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Móng Cái 1",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Móng Cái 2",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Móng Cái 3",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mông Dương",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Cốc",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Đức",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Hà",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Hanh",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng La",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Tân",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Yên",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thống Nhất",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Yên",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuần Châu",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Uông Bí",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vàng Danh",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Đồn",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Hưng",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thực",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Tử",
        provinceId: qnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "A Dơi",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ái Tử",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Đồn",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Lòng",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Gianh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Trạch",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bến Hải",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bến Quan",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bố Trạch",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam Hồng",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cam Lộ",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cồn Cỏ",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cồn Tiên",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cửa Tùng",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cửa Việt",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dân Hóa",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diên Sanh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đakrông",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hà",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Hới",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Lê",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Sơn",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Thuận",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Trạch",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gio Linh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Lăng",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiếu Giang",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Trạch",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàn Lão",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hướng Hiệp",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hướng Lập",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hướng Phùng",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khe Sanh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Điền",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Ngân",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Phú",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "La Lay",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lao Bảo",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lệ Ninh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lệ Thủy",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lìa",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Hóa",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thủy",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Ba Đồn",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Cửa Việt",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Đông Hà",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Gianh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Hải Lăng",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Trạch",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Châu",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Nha",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Trạch",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Ninh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Trạch",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Trị",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sen Ngư",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tà Rụt",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Gianh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lập",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Mỹ",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Trạch",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Triệu Bình",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Triệu Cơ",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Triệu Phong",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Thuần",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Ninh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Phú",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Sơn",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuyên Bình",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuyên Hóa",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuyên Lâm",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuyên Phú",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuyên Sơn",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Định",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hoàng",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Linh",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thủy",
        provinceId: qtProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Yên",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thuận",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bó Sinh",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng An",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Cơi",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Hặc",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Hoa",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Khoong",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Khương",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng La",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Lao",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Mai",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Mung",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Sại",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Sinh",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Sơ",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Sơn",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiềng Sung",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Co Mạ",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đoàn Kết",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Phù",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Huổi Một",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Bon",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hẹ",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lóng Phiêng",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lóng Sập",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mai Sơn",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mộc Châu",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mộc Sơn",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Muổi Nọi",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Bám",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Bang",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Bú",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Chanh",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Chiên",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Cơi",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường É",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Giôn",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Hung",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Khiêng",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường La",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Lạn",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Lầm",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Lèo",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Sại",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Lầu",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Ty",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Chiến",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pắc Ngà",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phiêng Cằm",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phiêng Khoài",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phiêng Pằn",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Yên",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Púng Bánh",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quỳnh Nhai",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Song Khủa",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Mã",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sốp Cộp",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Suối Tọ",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tà Hộc",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tạ Khoa",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tà Xùa",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phong",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Yên",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thảo Nguyên",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Châu",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tô Hiệu",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tô Múa",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tường Hạ",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Hồ",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Sơn",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xím Vàng",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Nha",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Châu",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Sơn",
        provinceId: slProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Lục Long",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Ninh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Tịnh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bến Cầu",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bến Lức",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Đức",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Hiệp",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Hòa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Minh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thành",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cần Đước",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cần Giuộc",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cầu Khởi",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Thành",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dương Minh Châu",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thành",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Hòa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Huệ",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Lập",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Lộc",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gò Dầu",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hảo Đước",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hậu Nghĩa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hậu Thạnh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Hòa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Hội",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Khánh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Thành",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Điền",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Thuận",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Hậu",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Hưng",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến Tường",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long An",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Cang",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Chữ",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hoa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hựu",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Thuận",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Ninh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Hòa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mộc Hóa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ An",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Hạnh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Lệ",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Lộc",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Quý",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thạnh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Yên",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhơn Hòa Lập",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhơn Ninh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhựt Tảo",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Điền",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ninh Thạnh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Chỉ",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Lý",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Thạnh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Vinh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Vĩnh Tây",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Rạch Kiến",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tầm Vu",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Biên",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Châu",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Đông",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hòa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hội",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hưng",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lân",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lập",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Long",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Ninh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phú",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tập",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tây",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thạnh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Trụ",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Bình",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Điền",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Đức",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Hóa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Lợi",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Phước",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thủ Thừa",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Mỹ",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Vong",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trảng Bàng",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Truông Mít",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuyên Bình",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tuyên Thạnh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vàm Cỏ",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Châu",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Công",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hưng",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thạnh",
        provinceId: tnProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Khánh",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Bể",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bá Xuyên",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bách Quang",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Thông",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Kạn",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bằng Thành",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bằng Vân",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thành",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Yên",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Minh",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Giàng",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chợ Đồn",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chợ Mới",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chợ Rã",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Côn Minh",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cường Lợi",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dân Tiến",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Phúc",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Từ",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điềm Thụy",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Định Hóa",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Hỷ",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Phúc",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Lương",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Xuân",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Sàng",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Lực",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hợp Thành",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kha Sơn",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Phượng",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "La Bằng",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "La Hiên",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lam Vỹ",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Linh Sơn",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nà Phặc",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Na Rì",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Cường",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Hòa",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngân Sơn",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Tá",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghiên Loan",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghinh Tường",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phan Đình Phùng",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Quang",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phổ Yên",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Bình",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Đình",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lạc",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lương",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thịnh",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phủ Thông",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Xuyên",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Lộc",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phúc Thuận",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phượng Tiến",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quan Triều",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Bạch",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Sơn",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quân Chu",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quyết Thắng",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sảng Mộc",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sông Công",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Cương",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Khánh",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Kỳ",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Công",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Mai",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Thịnh",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thần Sa",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Minh",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Quan",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tích Lương",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trại Cau",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tràng Xá",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trần Phú",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Hội",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Thành",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Phú",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Xuân",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Hán",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Lang",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Lăng",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thông",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Võ Nhai",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vô Tranh",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Dương",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Bình",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Phong",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thịnh",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Trạch",
        provinceId: tngProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Nông",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Đình",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bá Thước",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bát Mọt",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Biện Thượng",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bỉm Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Các Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Tân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Thạch",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Thủy",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Tú",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cẩm Vân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cổ Lũng",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Công Chính",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đào Duy Từ",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điền Lư",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Điền Quang",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Định Hòa",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Định Tân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Lương",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Quang",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thành",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Tiến",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Tiến",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giao An",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Long",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Trung",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạc Thành",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Bình",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hải Lĩnh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Rồng",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hậu Lộc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiền Kiệt",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoa Lộc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hóa Quỳ",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoạt Giang",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoằng Châu",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoằng Giang",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoằng Hóa",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoằng Lộc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoằng Phú",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoằng Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoằng Thanh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoằng Tiến",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồ Vương",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồi Xuân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hợp Tiến",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiên Thọ",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Tân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lam Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Linh Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lĩnh Toại",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Luận Thành",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lưu Vệ",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mậu Lâm",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Chanh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Lát",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Lý",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mường Mìn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Na Mèo",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Sầm Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nam Xuân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nga An",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nga Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nga Thắng",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghi Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Lặc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Liên",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Trạo",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyệt Ấn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyệt Viên",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhi Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Như Thanh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Như Xuân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nông Cống",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lệ",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Xuân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pù Luông",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pù Nhi",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quan Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Bình",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Chiểu",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Chính",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Ngọc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Ninh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Phú",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Trung",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Yên",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quý Lộc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quý Lương",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sao Vàng",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sầm Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Điện",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Thủy",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Chung",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Lư",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Thanh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Dân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Ninh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tiến",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Đô",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch Bình",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch Lập",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạch Quảng",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Kỳ",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Phong",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Quân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Vinh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thăng Bình",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thắng Lộc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thắng Lợi",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiên Phủ",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiết Ống",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiệu Hóa",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiệu Quang",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiệu Tiến",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiệu Toán",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thiệu Trung",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thọ Bình",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thọ Lập",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thọ Long",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thọ Ngọc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thọ Phú",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thọ Xuân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Ninh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thường Xuân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Trang",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tĩnh Gia",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tống Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Triệu Lộc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Triệu Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trúc Lâm",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Chính",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Hạ",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Lý",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Sơn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Thành",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Lâm",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Văn",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tượng Lĩnh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Lộc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vạn Xuân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Nho",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Văn Phú",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vân Du",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Lộc",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Bình",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Chinh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Du",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Hòa",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Lập",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Thái",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Tín",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Định",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Khương",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Nhân",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Ninh",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Phú",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thắng",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thọ",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Trường",
        provinceId: thProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Đông",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hội Đông",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hội Tây",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Khánh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Lạc",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Long",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Nhơn",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Nhơn Tây",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phú",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phú Đông",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Thới Đông",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bà Điểm",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bà Rịa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bàn Cờ",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bàu Bàng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bàu Lâm",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảy Hiền",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Tân Uyên",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bến Cát",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bến Thành",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Chánh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Châu",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Cơ",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Dương",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Đông",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Giã",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Hưng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Hưng Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Khánh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Lợi",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Lợi Trung",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Mỹ",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Phú",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Quới",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Tân",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Tây",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thạnh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thới",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Tiên",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Trị Đông",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Trưng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cát Lái",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cần Giờ",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cầu Kiệu",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cầu Ông Lãnh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chánh Hiệp",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chánh Hưng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chánh Phú Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Đức",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Pha",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chợ Lớn",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chợ Quán",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Côn Đảo",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Củ Chi",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dầu Tiếng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Dĩ An",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Diên Hồng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đất Đỏ",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hưng Thuận",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thạnh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đức Nhuận",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gia Định",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Gò Vấp",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hạnh Thông",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Bình",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Phước",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Bình",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Hiệp",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Hội",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Hưng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Lợi",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hóc Môn",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồ Tràm",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Long",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khánh Hội",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Long",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lái Thiêu",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Linh Xuân",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Bình",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Điền",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hải",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hương",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Nguyên",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Phước",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Sơn",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Trường",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Phụng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Thạnh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngãi Giao",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Thành",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhà Bè",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhiêu Lộc",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhuận Đức",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú An",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Định",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Giáo",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Hòa Đông",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lâm",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lợi",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Mỹ",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Nhuận",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thạnh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thọ",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thọ Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thuận",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Hải",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Long",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Thành",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Thắng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Rạch Dừa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sài Gòn",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Bình",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Long",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Thắng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tăng Nhơn Phú",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An Hội",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Bình",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Định",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Đông Hiệp",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hải",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hiệp",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hưng",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Khánh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Mỹ",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Nhựt",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phú",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phước",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Sơn",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Sơn Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Sơn Nhất",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Sơn Nhì",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tạo",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thới Hiệp",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thuận",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Uyên",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Vĩnh Lộc",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Nam",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tây Thạnh",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Mỹ",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh An",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh An",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Mỹ Tây",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thông Tây Hội",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới An",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thủ Dầu Một",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thủ Đức",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận An",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Giao",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thường Tân",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Mỹ Tây",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trừ Văn Thố",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Hội",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Lộc",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Tân",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vũng Tàu",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vườn Lài",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xóm Chiếu",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Hòa",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Sơn",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Thới Sơn",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuyên Mộc",
        provinceId: hcmProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Tường",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Đích",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Ngọc",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bạch Xa",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bản Máy",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Mê",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bắc Quang",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bằng Hành",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bằng Lang",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình An",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Ca",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Thuận",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Xa",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cán Tỷ",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cao Bồ",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chiêm Hóa",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Côn Lôn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Du Già",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Tâm",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thọ",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Văn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Yên",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đường Hồng",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đường Thượng",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giáp Trung",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Giang 1",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hà Giang 2",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Yên",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa An",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoàng Su Phì",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồ Thầu",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Sơn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hồng Thái",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hùng An",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hùng Đức",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hùng Lợi",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khâu Vai",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Khuôn Lùng",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiên Đài",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kiến Thiết",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Kim Bình",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lao Chải",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lâm Bình",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Liên Hiệp",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Linh Hồ",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lũng Cú",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lũng Phìn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lùng Tám",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lực Hành",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mậu Duệ",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mèo Vạc",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Ngọc",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Quang",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Sơn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Tân",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Thanh",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Minh Xuân",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Lâm",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nà Hang",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nấm Dẩn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nậm Dịch",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nghĩa Thuận",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Đường",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngọc Long",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhữ Khê",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Niêm Sơn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nông Tiến",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pà Vầy Sủ",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phố Bảng",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Linh",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Lương",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phù Lưu",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Pờ Ly Ngài",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quản Bạ",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quang Bình",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quảng Nguyên",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sà Phìn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Dương",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Thủy",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Vĩ",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sủng Máng",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tát Ngà",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Long",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Mỹ",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Quang",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thanh",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Tiến",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Trào",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Trịnh",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Bình",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Hòa",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thái Sơn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thàng Tín",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Thủy",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thắng Mố",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thông Nguyên",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thuận Hòa",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Lâm",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Nông",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thượng Sơn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Nguyên",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Yên",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tri Phú",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Hà",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Sơn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Thịnh",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Sinh",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tùng Bá",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tùng Vài",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vị Xuyên",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Việt Lâm",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Tuy",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xín Mần",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Giang",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Xuân Vân",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Cường",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Hoa",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Lập",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Minh",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Nguyên",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Phú",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Sơn",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Yên Thành",
        provinceId: tqProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Bình",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Định",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hiệp",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Hội",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Ngãi Trung",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Phú Tân",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Qui",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "An Trường",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ba Tri",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bảo Thạnh",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bến Tre",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Đại",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Minh",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Phú",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Bình Phước",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cái Ngang",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cái Nhum",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cái Vồn",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Càng Long",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cầu Kè",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Cầu Ngang",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Hòa",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Hưng",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Châu Thành",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Chợ Lách",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Duyên Hải",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại An",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đại Điền",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đôn Châu",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Hải",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đồng Khởi",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Đông Thành",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giao Long",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Giồng Trôm",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hàm Giang",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiệp Mỹ",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiếu Phụng",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hiếu Thành",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Bình",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Hiệp",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hòa Minh",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hoà Thuận",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hùng Hoà",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Khánh Trung",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Mỹ",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hưng Nhượng",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Hương Mỹ",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Châu",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Đức",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hiệp",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hòa",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hồ",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Hữu",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Thành",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Long Vĩnh",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lộc Thuận",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lục Sĩ Thành",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Hòa",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lương Phú",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Lưu Nghiệp Anh",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỏ Cày",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Chánh Hòa",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Long",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Mỹ Thuận",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngãi Tứ",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ngũ Lạc",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nguyệt Hoá",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhị Long",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhị Trường",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhơn Phú",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Nhuận Phú Tân",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phong Thạnh",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Khương",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Phụng",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Quới",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Tân",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Thuận",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phú Túc",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Hậu",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Long",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Phước Mỹ Trung",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quới An",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quới Điền",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Quới Thiện",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Song Lộc",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Song Phú",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Sơn Đông",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Bình",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tam Ngãi",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân An",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hạnh",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hào",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Hoà",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Long Hội",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Lược",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Ngãi",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Phú",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Quới",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thành Bình",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Thủy",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tân Xuân",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tập Ngãi",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tập Sơn",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thanh Đức",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Hải",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Phong",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Phú",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Phước",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thành Thới",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thạnh Trị",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Thới Thuận",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiên Thủy",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Tiểu Cần",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Côn",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Cú",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Ôn",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trà Vinh",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Hiệp",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Ngãi",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trung Thành",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Trường Long Hoà",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vinh Kim",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Thành",
        provinceId: vlProvince.id,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Vĩnh Xuân",
        provinceId: vlProvince.id,
      },
    }),
  ]);

  return provinces;
}
