export const demoUsers = [
  {
    id: "demo-admin-utama",
    name: "Admin Utama",
    email: "admin@maiwp.gov.my",
    password: "ChangeMe123!",
    role: "admin_utama",
    department: "Pentadbiran",
    department_name: "Pentadbiran",
  },
  {
    id: "demo-admin-bahagian",
    name: "Admin Bahagian BTM",
    email: "btm@maiwp.gov.my",
    password: "demo123",
    role: "admin_bahagian",
    department: "Bahagian Teknologi Maklumat",
    department_name: "Bahagian Teknologi Maklumat",
  },
];

export const demoKPIs = [
  {
    id: "demo-kpi-001",
    department: "Bahagian Teknologi Maklumat",
    kategoriUtama: "KPI",
    kpi: "Memastikan sistem digital utama MAIWP mencapai tahap ketersediaan perkhidmatan yang ditetapkan.",
    kategori: "Peratus",
    target: "95",
    bilangan: { sasaran: "", pencapaian: "" },
    peratus: { y: "100", x: "97", labelY: "Jumlah perkhidmatan", labelX: "Perkhidmatan tersedia" },
    masa: { sasaranTarikh: "", tarikhCapai: "" },
    tahap: [{ statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }],
    tahapSelected: null,
    peratusMinimum: { x: "", y: "", labelX: "", labelY: "" },
    peruntukan: "250000",
    perbelanjaan: "198500",
    percentBelanja: "79.40%",
  },
  {
    id: "demo-kpi-002",
    department: "Bahagian Agihan Zakat",
    kategoriUtama: "KPI",
    kpi: "Bilangan permohonan bantuan zakat yang diproses dalam tempoh sasaran.",
    kategori: "Bilangan",
    target: "1200",
    bilangan: { sasaran: "1200", pencapaian: "1185" },
    peratus: { x: "", y: "", labelX: "", labelY: "" },
    masa: { sasaranTarikh: "", tarikhCapai: "" },
    tahap: [{ statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }],
    tahapSelected: null,
    peratusMinimum: { x: "", y: "", labelX: "", labelY: "" },
    peruntukan: "1200000",
    perbelanjaan: "1130000",
    percentBelanja: "94.17%",
  },
  {
    id: "demo-kpi-003",
    department: "Bahagian Pembangunan Aset",
    kategoriUtama: "SKU",
    kpi: "Menyiapkan laporan kemajuan projek pembangunan aset mengikut tarikh yang ditetapkan.",
    kategori: "Masa",
    target: "2026-06-30",
    bilangan: { sasaran: "", pencapaian: "" },
    peratus: { x: "", y: "", labelX: "", labelY: "" },
    masa: { sasaranTarikh: "2026-06-30", tarikhCapai: "2026-06-25" },
    tahap: [{ statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }],
    tahapSelected: null,
    peratusMinimum: { x: "", y: "", labelX: "", labelY: "" },
    peruntukan: "800000",
    perbelanjaan: "612000",
    percentBelanja: "76.50%",
  },
  {
    id: "demo-kpi-004",
    department: "Unit Audit Dalaman",
    kategoriUtama: "SKU",
    kpi: "Pelaksanaan audit pematuhan dalaman bagi bahagian terpilih.",
    kategori: "Tahap Kemajuan",
    target: "100",
    bilangan: { sasaran: "", pencapaian: "" },
    peratus: { x: "", y: "", labelX: "", labelY: "" },
    masa: { sasaranTarikh: "", tarikhCapai: "" },
    tahap: [
      { statement: "Perancangan audit diluluskan", percent: "25" },
      { statement: "Kerja lapangan selesai", percent: "50" },
      { statement: "Draf laporan disediakan", percent: "75" },
      { statement: "Laporan akhir dibentangkan", percent: "100" },
    ],
    tahapSelected: 2,
    peratusMinimum: { x: "", y: "", labelX: "", labelY: "" },
    peruntukan: "90000",
    perbelanjaan: "54000",
    percentBelanja: "60.00%",
  },
  {
    id: "demo-kpi-005",
    department: "Bahagian Kewangan dan Pelaburan",
    kategoriUtama: "KPI",
    kpi: "Memastikan perbelanjaan operasi tidak melebihi had minimum kawalan bajet.",
    kategori: "Peratus Minimum",
    target: "85",
    bilangan: { sasaran: "", pencapaian: "" },
    peratus: { x: "", y: "", labelX: "", labelY: "" },
    masa: { sasaranTarikh: "", tarikhCapai: "" },
    tahap: [{ statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }],
    tahapSelected: null,
    peratusMinimum: { y: "500000", x: "405000", labelY: "Peruntukan", labelX: "Perbelanjaan" },
    peruntukan: "500000",
    perbelanjaan: "405000",
    percentBelanja: "81.00%",
  },
  {
    id: "demo-kpi-006",
    department: "Bahagian Pengurusan Sistem Maklumat",
    kategoriUtama: "SKU",
    kpi: "Menyediakan latihan pengguna sistem pemantauan prestasi kepada pegawai bahagian.",
    kategori: "Bilangan",
    target: "6",
    bilangan: { sasaran: "6", pencapaian: "4" },
    peratus: { x: "", y: "", labelX: "", labelY: "" },
    masa: { sasaranTarikh: "", tarikhCapai: "" },
    tahap: [{ statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }, { statement: "", percent: "" }],
    tahapSelected: null,
    peratusMinimum: { x: "", y: "", labelX: "", labelY: "" },
    peruntukan: "45000",
    perbelanjaan: "22000",
    percentBelanja: "48.89%",
  },
];

export function ensureDemoUsers() {
  const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  const missingUsers = demoUsers.filter(
    (demoUser) => !savedUsers.some((user) => user.email === demoUser.email)
  );

  if (missingUsers.length > 0) {
    localStorage.setItem("users", JSON.stringify([...savedUsers, ...missingUsers]));
  }
}

export function seedDemoKPIsIfEmpty() {
  const savedKPIs = JSON.parse(localStorage.getItem("kpiList") || "[]");

  if (savedKPIs.length > 0) {
    return savedKPIs;
  }

  localStorage.setItem("kpiList", JSON.stringify(demoKPIs));
  return demoKPIs;
}
