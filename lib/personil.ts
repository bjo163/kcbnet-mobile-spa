export type Personil = {
  slug: string
  name: string
  role: string
  avatar: string // path in /public
  idcards: string[] // paths in /public
  partner?: string
  idNumber?: string
  company?: string
}

export const PERSONIL: Personil[] = [
  {
    slug: "ridwan-suhendar",
    name: "Ridwan Suhendar",
    role: "Teknisi",
    avatar: "/images/Personil/idcard_page_1.png",
    idcards: [
      "/images/Personil/idcard_page_1.png",
    ],
    partner: "Exatel Telecom",
    idNumber: "KCB0032024",
    company: "KCBNet",
  },
  {
    slug: "dadan",
    name: "Dadan",
    role: "Teknisi",
    avatar: "/images/Personil/idcard_page_2.png",
    idcards: [
      "/images/Personil/idcard_page_2.png",
    ],
    partner: "Exatel Telecom",
    idNumber: "KCB0042024",
    company: "KCBNet",
  },
  {
    slug: "bagus",
    name: "Bagus",
    role: "Teknisi",
    avatar: "/images/Personil/idcard_page_4.png",
    idcards: [
      "/images/Personil/idcard_page_4.png",
    ],
    partner: "Exatel Telecom",
    idNumber: "KCB0062025",
    company: "KCBNet",
  },
  {
    slug: "iki-zanta",
    name: "Iki Zanta",
    role: "Teknisi",
    avatar: "/images/Personil/idcard_page_3.png",
    idcards: [
      "/images/Personil/idcard_page_3.png",
    ],
    partner: "Exatel Telecom",
    idNumber: "KCB0052025",
    company: "KCBNet",
  },
  {
    slug: "andri-eko-m",
    name: "Andri Eko. M",
    role: "Leader",
    avatar: "/images/Personil/idcard_page_5.png",
    idcards: [
      "/images/Personil/idcard_page_5.png",
    ],
    partner: "Exatel Telecom",
    idNumber: "KCB0022022",
    company: "KCBNet",
  },
  {
    slug: "haryanto",
    name: "Haryanto",
    role: "Direktur Operasional",
    avatar: "/images/Personil/idcard_page_6.png",
    idcards: [
      "/images/Personil/idcard_page_6.png",
    ],
    partner: "Exatel Telecom",
    idNumber: "KCB0012021",
    company: "KCBNet",
  },
]