export type Personil = {
  slug: string
  name: string
  role: string
  avatar: string // path in /public
  idcards: string[] // paths in /public
  partner?: string
}

export const PERSONIL: Personil[] = [
  {
    slug: "ridwan-suhendar",
    name: "Ridwan Suhendar",
    role: "Teknisi",
    avatar: "/images/Personil/idcard_page_1.png",
    idcards: [
      "/images/Personil/idcard_page_1.png",
      "/images/Personil/idcard_page_2.png",
      "/images/Personil/idcard_page_3.png",
      "/images/Personil/idcard_page_4.png",
      "/images/Personil/idcard_page_5.png",
      "/images/Personil/idcard_page_6.png",
    ],
    partner: "Exatel Telco",
  },
  {
    slug: "ahmad-fauzi",
    name: "Ahmad Fauzi",
    role: "Network Engineer",
    avatar: "/images/Personil/idcard_page_2.png",
    idcards: [
      "/images/Personil/idcard_page_2.png",
    ],
    partner: "KCBNet",
  },
  {
    slug: "siti-nurhaliza",
    name: "Siti Nurhaliza",
    role: "Customer Service",
    avatar: "/images/Personil/idcard_page_3.png",
    idcards: [
      "/images/Personil/idcard_page_3.png",
    ],
    partner: "KCBNet",
  },
  {
    slug: "budi-santoso",
    name: "Budi Santoso",
    role: "Field Technician",
    avatar: "/images/Personil/idcard_page_4.png",
    idcards: [
      "/images/Personil/idcard_page_4.png",
    ],
    partner: "KCBNet",
  },
  {
    slug: "rina-wati",
    name: "Rina Wati",
    role: "Technical Support",
    avatar: "/images/Personil/idcard_page_5.png",
    idcards: [
      "/images/Personil/idcard_page_5.png",
    ],
    partner: "KCBNet",
  },
  {
    slug: "dedi-kurniawan",
    name: "Dedi Kurniawan",
    role: "Installation Supervisor",
    avatar: "/images/Personil/idcard_page_6.png",
    idcards: [
      "/images/Personil/idcard_page_6.png",
    ],
    partner: "KCBNet",
  },
]