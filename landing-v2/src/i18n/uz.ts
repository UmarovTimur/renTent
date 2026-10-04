import { FREE_HOURS, HALF_DAY_HOURS } from "@/lib/rentalDays";
import type { Dictionary } from "@/i18n/ru";

// Uzbek (Latin script). Base translation from tilmoch.ai, edited by hand for
// consistent terms: "sutka" for a 24-hour rental day, "jihozlar" for gear,
// "chodir" for a tent, ‘ (U+2018) in o‘/g‘ and ’ (U+2019) for the tutuq belgisi.
// Where a word is turned into a link (StepsSection: "Telegram"), it stands
// without a suffix ("Telegram orqali", not "Telegramga"), so the link arrow
// doesn't split the word.

/** "1 sutka", "2 sutka", "1,5 sutka" (Uzbek nouns don't take a plural after numbers) */
const formatDays = (n: number) => `${String(n).replace(".", ",")} sutka`;

/** "1 soat", "5 soat" */
const formatHours = (n: number) => `${n} soat`;

export const uz: Dictionary = {
  intl: "uz-Latn-UZ",
  meta: {
    title: "Turistik jihozlar ijarasi — Toshkent",
    description:
      "Sotib olish shart bo‘lmagan tog‘ jihozlari: Toshkentda chodirlar, uxlash qoplari, ryukzaklar va treking tayoqlari ijarasi.",
    ogDescription: "Sotib olish shart bo‘lmagan tog‘ jihozlari.",
  },
  languageName: "O‘zbekcha",
  header: {
    menu: {
      top: "Bosh sahifa",
      how: "Qanday ishlaydi",
      pricing: "Muddat va narxlar",
      catalog: "Katalog",
      contacts: "Aloqa",
    },
    language: "Til",
  },
  preloader: {
    fast: "Tezkor ijara",
    calling: "Tog‘lar chorlayapti",
    cards: [
      "Ikki o‘rinli chodir: tog‘lar fonida sariq gumbaz, ijara narxi sutkasiga 90 000 so‘m",
      "Tog‘lar fonida to‘rt o‘rinli Naturehike chodiri, ijara narxi sutkasiga 120 000 so‘m",
      "Sakkiz o‘rinli kemping chodir-shatyor, ijara narxi sutkasiga 250 000 so‘m",
      "O‘n ikki o‘rinli to‘q sariq kemping chodiri, ijara narxi sutkasiga 350 000 so‘m",
    ],
  },
  hero: {
    headline: ["Toshkentda", "tog‘ jihozlari", "ijarasi"],
    tagLeft: "Chodirlar ijarasi",
    tagRight: "Turistik jihozlar ijarasi",
    lead: "Sayohat va kemping uchun chodirlar, uxlash qoplari, ryukzaklar va turistik idishlar ijarasi.",
    facts: [
      { value: "24/7", label: "xizmat ko‘rsatish" },
      { value: "100%", label: "original mahsulotlar" },
    ],
    call: "Qo‘ng‘iroq qilish",
    telegram: "Telegramga yozish",
    toCatalog: "Katalogni ko‘rish",
  },
  steps: {
    title: "Qanday ishlaydi",
    lead: "To‘rt qadam: Telegram orqali bron, pasport garovga — va siz tog‘dasiz.",
    items: [
      "Telegram orqali nima kerakligi va qaysi sanalarga ekanini yozasiz: menejer mavjudligini tekshirib, 100 000 so‘m oldindan to‘lov bilan bron qiladi",
      "Pasportni garovga qoldirasiz, qolgan summani to‘laysiz va jihozlarni tekshirasiz",
      "Ijara muddati davomida jihozlar sizniki, ularning butligiga siz javob berasiz",
      "Hammasini o‘z vaqtida qaytarasiz va tekshiruvdan so‘ng pasportingizni olasiz",
    ],
  },
  pricing: {
    title: "Sanalar uchun emas, sutkalar uchun to‘laysiz",
    lead: "Jihozlarni olgan paytingizdan qaytargan paytingizgacha bo‘lgan soatlarni sanaymiz. Har 24 soat — bir sutka, qoldiq esa yarim yoki butun sutkagacha yaxlitlanadi.",
    rounding: {
      eyebrow: "Yaxlitlash",
      text: `Butun sutkalardan ortiq ${FREE_HOURS} soatgacha bepul, ${FREE_HOURS + 1} soatdan ${HALF_DAY_HOURS} soatgacha — yarim sutka, undan ko‘p — yana bir sutka`,
      value: `+${FREE_HOURS} soat`,
      note: "qadam — 12 soat",
    },
    minimum: {
      eyebrow: "Minimum",
      text: `Eng kam ijara muddati: ${24 + FREE_HOURS} soatgacha bo‘lgan har qanday muddat bir sutka hisoblanadi`,
      value: "1 sutka",
      note: `${24 + FREE_HOURS} soatgacha`,
    },
    total: {
      eyebrow: "Jami",
      text: "Ijara narxi: sutkalik narx × buyumlar soni × sutkalar soni",
      formula: [
        // Short terms: the formula stays on one row on phones
        { term: "Narx", note: "sutkasiga" },
        { term: "Buyum", note: "soni" },
        { term: "Sutka", note: "soat bo‘yicha" },
      ],
    },
  },
  calc: {
    eyebrow: "Muddatni hisoblang",
    prompt: "Jihozlarni qachon olib, qachon qaytarishingizni ko‘rsating — necha sutka uchun to‘lashni ko‘rsatamiz",
    pickup: "Oldim",
    pickupAlt: "Ryukzak va treking tayog‘i bilan sayyoh qiz tumanda toshlar bo‘ylab ko‘tarilmoqda",
    giveBack: "Qaytardim",
    giveBackAlt: "Sayyoh tog‘da tosh ustida dam olmoqda",
    date: "sana",
    time: "vaqt",
    datePlaceholder: "kk.oo.yyyy",
    error: "Qaytarish vaqti olish vaqtidan keyin bo‘lishi kerak",
    toPay: "To‘lov",
    nthDay: (n: number) => `${n}-sutka`,
    hoursShort: "soat",
    minimum: "kamida 1 sutka",
    extraNote: { 0: "bepul", 0.5: "yarim sutka", 1: "yana bir sutka" },
    explain: {
      underDay: () => `Bir sutkadan kam — eng kam muddat sifatida hisoblaymiz: ${formatDays(1)}`,
      exact: (days: number) => `Roppa-rosa ${formatDays(days)}, qoldiqsiz`,
      free: (hours: number) =>
        `Butun sutkalardan ortiq ${formatHours(hours)} uchun to‘lanmaydi — ${FREE_HOURS} soatgacha bepul`,
      half: (hours: number) =>
        `Butun sutkalardan ortiq ${formatHours(hours)} — ${FREE_HOURS + 1} soatdan ${HALF_DAY_HOURS} soatgacha yarim sutka hisoblanadi`,
      full: (hours: number) =>
        `Butun sutkalardan ortiq ${formatHours(hours)} — ${HALF_DAY_HOURS} soatdan ko‘p, shuning uchun bu yana bir sutka`,
    },
    formatDays,
    formatHours,
  },
  brands: { label: "Jihoz brendlari" },
  catalog: {
    fullPrice: "Narxlar ro‘yxati",
    search: "Katalogdan qidirish",
    searchPlaceholder: "Chodir, fonar, gorelka…",
    clearSearch: "Qidiruvni tozalash",
    nothingFound: "Hech narsa topilmadi",
    nothingFoundHint: "Boshqa so‘rov yoki mahsulot turini sinab ko‘ring.",
    perDay: "sutka",
    videos: "Video yo‘riqnomalar",
    downloadVideo: "Videoni yuklab olish",
    filterLabel: "Mahsulot turi",
    categories: {
      all: "Hammasi",
      tents: "Chodirlar",
      camp: "Mebel va uyqu",
      trekking: "Treking",
      kitchen: "Oshxona va idishlar",
      light: "Yorug‘lik va energiya",
    },
    title: "Ijara katalogi",
    subtitle: "Safarga tayyor jihozlar. Narx bir sutkalik ijara uchun ko‘rsatilgan.",
    currency: "so‘m",
    photo: (name: string, n: number) => `${name} — ${n}-rasm`,
    photoN: (n: number) => `${n}-rasm`,
    prev: "Oldingi rasm",
    next: "Keyingi rasm",
    close: "Yopish",
    zoomIn: "Kattalashtirish",
    zoomOut: "Kichraytirish",
  },
  product: {
    back: "Katalog",
    note: "mavjudligini menejer aniqlab beradi",
    perks: [
      "Juma kuni kechqurun olib, yakshanba kuni kechqurun qaytaring: dam olish kunlari 2 sutka hisoblanadi",
      "Kerakli sanalarda aniq mavjudligini menejerdan oldindan bilib olgan ma’qul",
      "Ijara muddatiga pasport garovga qoldiriladi",
    ],
    moodTitle: "Tog‘lar chorlayapti",
    moodLead: "Jihozlar safarga tayyor. Safar kuni olib keting va yurishdan so‘ng darhol qaytaring.",
    metaTitle: (name: string) => `${name} — Toshkentda ijaraga`,
  },
  cart: {
    title: "Savat",
    open: "Savatni ochish",
    close: "Savatni yopish",
    add: "Savatga",
    addTo: (name: string) => `«${name}»ni savatga qo‘shish`,
    inCart: (n: number) => `Savatda: ${n}`,
    checkout: "Rasmiylashtirish",
    empty: "Savat hozircha bo‘sh",
    emptyHint: "Katalogdan jihozlarni qo‘shing, biz menejer uchun buyurtma tayyorlaymiz.",
    toCatalog: "Katalogga o‘tish",
    decrease: "Kamaytirish",
    increase: "Ko‘paytirish",
    remove: "Olib tashlash",
    clear: "Tozalash",
    dates: "Qachon kerak",
    pickup: "Olaman",
    giveBack: "Qaytaraman",
    dateError: "Qaytarish olishdan keyin bo‘lishi kerak",
    weekendHint: "Juma kuni kechqurun olib, yakshanba kuni kechqurun qaytaring: bor-yo‘g‘i 2 sutka",
    perDay: "sutkasiga",
    total: "Jami",
    forDays: (days: string) => `${days} uchun`,
    needDates: "Sanalarni ko‘rsating, summani hisoblab beramiz",
    comment: "Izoh",
    commentPlaceholder: "Menejerga savol yoki istaklar",
    send: "Menejerga yuborish",
    sendHint: "Telegramda tayyor ro‘yxat bilan chat ochiladi. Menejer sanalaringiz uchun mavjudligini tasdiqlaydi.",
    message: {
      greeting: "Assalomu alaykum! Jihozlarni ijaraga olmoqchiman 🏕",
      pickup: "Olaman",
      giveBack: "Qaytaraman",
      term: "Muddat",
      items: "Jihozlar",
      perDay: "sutka",
      total: "Jami",
      comment: "Izoh",
      question: "Iltimos, ayting-chi, shu sanalarda hammasi mavjudmi?",
    },
  },
  faq: {
    title: "Ko‘p beriladigan savollar",
    tentPrices: {
      q: "Chodir ijarasi qancha turadi?",
      a: (list: string) =>
        `Sutkalik narx sig‘imiga bog‘liq: ${list}. Jami — sutkalik narx × sutkalar soni; juma kechqurunidan yakshanba kechqurunigacha dam olish kunlari — 2 sutka.`,
    },
    items: [
      {
        q: "Ijara sutkalari qanday hisoblanadi?",
        a: `Jihozlarni olgan paytingizdan qaytarguningizgacha bo‘lgan soatlarni sanaymiz: har 24 soat — bir sutka. Butun sutkalardan ortiq ${FREE_HOURS} soatgacha bepul, ${FREE_HOURS + 1} soatdan ${HALF_DAY_HOURS} soatgacha — yarim sutka, undan ko‘p — yana bir sutka. Eng kam muddat — 1 sutka.`,
      },
      {
        q: "Jihozlarni ijaraga olish uchun nima kerak?",
        a: "Pasport — u ijara muddatiga garov sifatida qoladi. Qolgan summani jihozlarni olayotganda to‘laysiz, pasportni esa jihozlar qaytarilib, tekshirilgandan so‘ng olasiz.",
      },
      {
        q: "Jihozlarni qanday bron qilsa bo‘ladi?",
        a: "Menejerga Telegramda nima kerakligi va qaysi sanalarga ekanini yozing. U mavjudligini tekshirib, 100 000 so‘m oldindan to‘lov bilan bron qiladi.",
      },
      {
        q: "Jihozlarni qayerdan olib, qayerga qaytarish kerak?",
        a: "Toshkentda. Berish nuqtasi va qulay vaqtni bron qilgandan so‘ng menejer bilan Telegramda kelishib olamiz.",
      },
      {
        q: "Bir nechta buyumni birdaniga ijaraga olsa bo‘ladimi?",
        a: "Ha, ko‘pchilik to‘plam oladi: chodir, uxlash qoplari, gilamchalar va idishlar. Hammasini saytdagi savatga qo‘shing — u summasi bilan ro‘yxat tuzib, Telegramda menejerga yuboradi.",
      },
      {
        q: "Jihozlar shikastlansa nima bo‘ladi?",
        a: "Jihozlar uchun olingan paytdan qaytarilgunga qadar ijarachi javob beradi. Buzilish, kuchli ifloslanish yoki yo‘qolish holatida ta’mirlash, tozalash yoki almashtirish qiymati qoplanadi.",
      },
    ],
  },
  cta: {
    title: "Bizga yozing, jihoz tanlashda yordam beramiz",
    lead: "Kerakli sanalarda aniq mavjudligini menejerdan oldindan, ayniqsa dam olish kunlari oldidan bilib olgan ma’qul. Juma kuni kechqurun olib, yakshanba kuni kechqurun qaytarsangiz — bor-yo‘g‘i 2 sutka.",
    button: "Menejerga yozish",
  },
  footer: {
    photoAlt: "Tog‘larda quyosh botishidagi chodir — 3000 m+ balandlikda dam olish",
    title: "Tog‘larga yengil",
    lead: "Yiliga bir-ikki marta yurish uchun chodir sotib olishning nima keragi bor? Ijaraga oling va uni qayerda saqlashni o‘ylamang.",
    telegram: "Telegramga yozish",
    socials: "ijtimoiy tarmoqlarda",
    copyright: "rentTent — turistik jihozlar ijarasi, Toshkent",
    developedBy: "Saytni ishlab chiqdi",
  },
  terms: {
    trigger: "Foydalanish shartlari",
    updated: "2026-yil 29-sentabrdagi tahrir",
    close: "Yopish",
    sections: [
      {
        title: "Ommaviy oferta hisoblanmaydi",
        body: [
          "Saytdagi barcha ma’lumotlar, jumladan jihozlarning tavsiflari, fotosuratlari, xususiyatlari va narxlari faqat axborot xarakteriga ega va ommaviy oferta hisoblanmaydi.",
          "Ijara shartnomasi alohida — buyurtma menejer bilan kelishilganda va jihozlar berilganda tuziladi.",
        ],
      },
      {
        title: "Narxlar va mavjudlik",
        body: [
          "Ko‘rsatilgan narxlar taxminiy bo‘lib, ijara muddati, mavsum va komplektatsiyaga qarab o‘zgarishi mumkin. Bron qilishdan oldin joriy narx va mavjudlikni Telegramda menejerdan aniqlang.",
          "Fotosuratlar haqiqiy jihozlardan rangi, komplektatsiyasi va tashqi ko‘rinishi bo‘yicha biroz farq qilishi mumkin.",
        ],
      },
      {
        title: "Ijara shartlari",
        body: [
          "Muddatlar, garov, berish uchun hujjatlar va qaytarish tartibi ijarani rasmiylashtirishda belgilanadi va menejer tomonidan ma’lum qilinadi.",
        ],
      },
      {
        title: "Jihozlarni tekshirish va saqlash",
        body: [
          "Mijoz jihozlarni olayotganda ularning to‘liqligi va butligini mustaqil tekshirishi shart. E’tirozlar berilishidan oldin menejerga aytilishi kerak — olingandan so‘ng jihozlar soz holatda va e’tirozsiz qabul qilingan hisoblanadi.",
          "Mijoz jihozlarni olgan paytdan qaytargunga qadar ular uchun to‘liq javobgar. Buzilish, shikastlanish, odatdagidan ortiq ifloslanish yoki yo‘qolish holatida mijoz ta’mirlash, tozalash yoki almashtirish qiymatini qoplaydi. Summa garovdan ushlab qolinishi mumkin.",
        ],
      },
      {
        title: "Xavfsizlik",
        body: [
          "Tog‘ga yurish va chiqishlar xavf bilan bog‘liq. Ob-havo, marshrut va tayyorgarligingizni o‘zingiz baholaysiz hamda jihozlardan xavfsiz foydalanish uchun o‘zingiz javob berasiz.",
          "Saytdagi ob-havo ma’lumotlari ochiq manbalardan olingan va ma’lumot uchun keltiriladi.",
        ],
      },
      {
        title: "Javobgarlik",
        body: [
          "Biz saytdagi ma’lumotlarni dolzarb saqlashga harakat qilamiz, ammo noaniqliklar yo‘qligiga kafolat bermaymiz va faqat sayt materiallari asosida qabul qilingan qarorlar uchun javobgar emasmiz.",
          "Saytda tashqi xizmatlarga (Telegram, Instagram) havolalar bor; ularning ishi va siyosati uchun biz javobgar emasmiz.",
        ],
      },
      {
        title: "Shaxsiy ma’lumotlar",
        body: [
          "Sayt shakllar orqali shaxsiy ma’lumotlarni yig‘maydi. Buyurtma rasmiylashtirilayotganda menejerga bergan ma’lumotlaringiz faqat aloqa va ijarani rasmiylashtirish uchun ishlatiladi hamda O‘zbekiston Respublikasi qonunchiligida nazarda tutilgan hollardan tashqari uchinchi shaxslarga berilmaydi.",
        ],
      },
      {
        title: "Sayt materiallari",
        body: [
          "Saytdagi matnlar, fotosuratlar, logotip va dizayn rentTentga tegishli yoki huquq egalarining ruxsati bilan foydalaniladi. Roziliksiz nusxa ko‘chirish taqiqlanadi.",
        ],
      },
      {
        title: "O‘zgartirishlar",
        body: [
          "Biz ushbu shartlarni oldindan ogohlantirmasdan yangilashimiz mumkin. Saytdan foydalanishda davom etib, siz joriy tahrirga rozilik bildirasiz.",
        ],
      },
    ],
  },
};
