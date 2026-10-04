import { FREE_HOURS, HALF_DAY_HOURS } from "@/lib/rentalDays";
import type { Dictionary } from "@/i18n/ru";

/** "1 day", "2 days", "1.5 days" */
const formatDays = (n: number) => `${n} ${n === 1 ? "day" : "days"}`;

/** "1 hour", "5 hours" */
const formatHours = (n: number) => `${n} ${n === 1 ? "hour" : "hours"}`;

export const en: Dictionary = {
  intl: "en-GB",
  meta: {
    title: "Outdoor gear rental — Tashkent",
    description:
      "Mountain gear you don't have to buy: tents, sleeping bags, backpacks and trekking poles for rent in Tashkent.",
    ogDescription: "Mountain gear you don't have to buy.",
  },
  languageName: "English",
  header: {
    menu: {
      top: "Home",
      how: "How it works",
      pricing: "Terms & prices",
      catalog: "Catalog",
      contacts: "Contacts",
    },
    language: "Language",
  },
  preloader: {
    fast: "Quick rental",
    // two lines: one long line runs into the cards
    calling: "The mountains\nare calling",
    cards: [
      "Two-person tent: a yellow dome against the mountains, 90,000 UZS per day",
      "Four-person Naturehike tent against the mountains, 120,000 UZS per day",
      "Eight-person camping cabin tent, 250,000 UZS per day",
      "Twelve-person orange camping tent, 350,000 UZS per day",
    ],
  },
  hero: {
    headline: ["Mountain", "gear rental", "in Tashkent"],
    tagLeft: "Tents for rent",
    tagRight: "Outdoor gear rental",
    lead: "Tents, sleeping bags, backpacks and camping cookware for hiking and camping trips.",
    facts: [
      { value: "24/7", label: "service" },
      { value: "100%", label: "genuine products" },
    ],
    call: "Call",
    telegram: "Message us on Telegram",
    toCatalog: "View catalog",
  },
  steps: {
    title: "How it works",
    lead: "Four steps: book on Telegram, leave your passport as a deposit — and you're off to the mountains.",
    items: [
      "Message us on Telegram with what you need and for which dates: the manager checks availability and books it for a 100,000 UZS prepayment",
      "Leave your passport as a deposit, pay the rest and check the gear",
      "The gear is yours for the whole rental period, and you're responsible for keeping it safe",
      "Bring everything back on time and get your passport back after the check",
    ],
  },
  pricing: {
    title: "Pay per day, not per date",
    lead: "We count the hours from the moment you pick up the gear to the moment you return it. Every 24 hours is one day, and the remainder is rounded to a half or a full day.",
    rounding: {
      eyebrow: "Rounding",
      text: `Up to ${FREE_HOURS} hours over full days is free, ${FREE_HOURS + 1} to ${HALF_DAY_HOURS} hours is half a day, more is another day`,
      value: `+${FREE_HOURS} h`,
      note: "12-hour step",
    },
    minimum: {
      eyebrow: "Minimum",
      text: `Minimum rental period: anything up to ${24 + FREE_HOURS} hours counts as one day`,
      value: "1 day",
      note: `up to ${24 + FREE_HOURS} hours`,
    },
    total: {
      eyebrow: "Total",
      text: "Rental cost: price per day × number of items × number of days",
      formula: [
        { term: "Price", note: "per day" },
        { term: "Items", note: "quantity" },
        { term: "Days", note: "by the hour" },
      ],
    },
  },
  calc: {
    eyebrow: "Work out the period",
    prompt: "Tell us when you'll pick up and return the gear — we'll show how many days you pay for",
    pickup: "Picked up",
    pickupAlt: "Hiker with a backpack and a trekking pole climbing over rocks in the fog",
    giveBack: "Returned",
    giveBackAlt: "Hiker resting on a rock in the mountains",
    date: "date",
    time: "time",
    datePlaceholder: "dd.mm.yyyy",
    error: "The return time must be later than the pickup time",
    toPay: "To pay",
    nthDay: (n: number) => `Day ${n}`,
    hoursShort: "h",
    minimum: "minimum 1 day",
    extraNote: { 0: "free", 0.5: "half a day", 1: "another day" },
    explain: {
      underDay: () => `Less than a day — counted as the minimum, ${formatDays(1)}`,
      exact: (days: number) => `Exactly ${formatDays(days)}, nothing left over`,
      free: (hours: number) => `${formatHours(hours)} over full days are free — up to ${FREE_HOURS} hours cost nothing`,
      half: (hours: number) =>
        `${formatHours(hours)} over full days — ${FREE_HOURS + 1} to ${HALF_DAY_HOURS} hours count as half a day`,
      full: (hours: number) =>
        `${formatHours(hours)} over full days — more than ${HALF_DAY_HOURS}, so it's another day`,
    },
    formatDays,
    formatHours,
  },
  brands: { label: "Gear brands" },
  catalog: {
    fullPrice: "Download full price list",
    search: "Search the catalog",
    searchPlaceholder: "Tent, flashlight, burner…",
    clearSearch: "Clear search",
    nothingFound: "Nothing found",
    nothingFoundHint: "Try another search or product type.",
    perDay: "day",
    videos: "How-to videos",
    downloadVideo: "Download video",
    filterLabel: "Product type",
    categories: { all: "All", tents: "Tents", camp: "Furniture & sleep", trekking: "Trekking", kitchen: "Kitchen & dishes", light: "Light & power" },
    title: "Rental catalog",
    subtitle: "Gear that's ready for the trip. Prices are per day of rental.",
    currency: "UZS",
    photo: (name: string, n: number) => `${name} — photo ${n}`,
    photoN: (n: number) => `Photo ${n}`,
    prev: "Previous photo",
    next: "Next photo",
    close: "Close",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
  },
  product: {
    back: "Catalog",
    note: "the manager will confirm your dates",
    perks: [
      "Pick up on Friday evening, return on Sunday evening: the weekend counts as 2 days",
      "Check exact availability for your dates with the manager in advance",
      "Your passport as a deposit for the rental",
    ],
    moodTitle: "The mountains are calling",
    moodLead: "The gear is ready to go. Pick it up on the day of the trip and return it right after the hike.",
    metaTitle: (name: string) => `${name} for rent in Tashkent`,
  },
  cart: {
    title: "Cart",
    open: "Open the cart",
    close: "Close the cart",
    add: "Add to cart",
    addTo: (name: string) => `Add “${name}” to the cart`,
    inCart: (n: number) => `In cart: ${n}`,
    checkout: "Check out",
    empty: "Your cart is empty",
    emptyHint: "Add gear from the catalog and we'll put together a request for the manager.",
    toCatalog: "Go to the catalog",
    decrease: "Fewer",
    increase: "More",
    remove: "Remove",
    clear: "Clear",
    dates: "When you need it",
    pickup: "Pick up",
    giveBack: "Return",
    dateError: "The return must be after the pickup",
    weekendHint: "Pick up on Friday evening and return on Sunday evening: that's just 2 days",
    perDay: "per day",
    total: "Total",
    forDays: (days: string) => `for ${days}`,
    needDates: "Set the dates and we'll work out the total",
    comment: "Comment",
    commentPlaceholder: "Questions or wishes for the manager",
    send: "Send to the manager",
    sendHint: "A Telegram chat opens with the list ready to send. The manager will confirm availability for your dates.",
    message: {
      greeting: "Hi! I'd like to rent some gear 🏕",
      pickup: "Pick up",
      giveBack: "Return",
      term: "Rental",
      items: "Gear",
      perDay: "day",
      total: "Total",
      comment: "Comment",
      question: "Could you check that everything is available for these dates?",
    },
  },
  faq: {
    title: "FAQ",
    tentPrices: {
      q: "How much does it cost to rent a tent?",
      a: (list: string) => `The price per day depends on the size: ${list}. The total is the daily price × the number of days; a weekend from Friday evening to Sunday evening counts as 2 days.`,
    },
    items: [
      {
        q: "How are rental days counted?",
        a: `We count the hours from when you pick the gear up until you return it: every 24 hours is one day. Up to ${FREE_HOURS} hours over whole days are free, ${FREE_HOURS + 1} to ${HALF_DAY_HOURS} hours count as half a day, more as another full day. The minimum rental is 1 day.`,
      },
      {
        q: "What do I need to rent gear?",
        a: "Your passport, which stays with us as a deposit for the rental. You pay the rest of the price when you pick the gear up and get your passport back once it's returned and checked.",
      },
      {
        q: "How do I book gear?",
        a: "Message the manager on Telegram with what you need and for which dates. They'll check availability and book it with a 100,000 UZS prepayment.",
      },
      {
        q: "Where do I pick up and return the gear?",
        a: "In Tashkent. The manager agrees the pickup point and a convenient time with you on Telegram after booking.",
      },
      {
        q: "Can I rent several items at once?",
        a: "Yes, most people take a set: a tent, sleeping bags, mats and cookware. Add everything to the cart on the site — it builds the list with the total and sends it to the manager on Telegram.",
      },
      {
        q: "What if the gear gets damaged?",
        a: "From pickup until return the renter is responsible for the gear. If it breaks, gets badly soiled or is lost, the cost of repair, cleaning or replacement is covered by the renter.",
      },
    ],
  },
  cta: {
    title: "Message us — we'll help you choose your gear",
    lead: "Check exact availability for your dates with the manager in advance, especially before a weekend. Pick up on Friday evening, return on Sunday evening: that's just 2 days.",
    button: "Message the manager",
  },
  footer: {
    photoAlt: "Tent at sunset in the mountains — a break at 3,000 m+",
    title: "Travel light",
    lead: "Why buy a tent for a couple of trips a year? Rent one and never worry about where to store it.",
    telegram: "Message us on Telegram",
    socials: "find us online",
    copyright: "rentTent — outdoor gear rental, Tashkent",
    developedBy: "Website by",
  },
  terms: {
    trigger: "Terms of use",
    updated: "Last updated September 29, 2026",
    close: "Close",
    sections: [
      {
        title: "Not a public offer",
        body: [
          "All information on this website, including descriptions, photos, specifications and prices of the gear, is for information purposes only and is not a public offer.",
          "The rental agreement is concluded separately — when the order is agreed with the manager and the gear is handed over.",
        ],
      },
      {
        title: "Prices and availability",
        body: [
          "The prices shown are approximate and may vary depending on the rental period, season and set. Check the current price and availability with the manager on Telegram before booking.",
          "Photos may differ slightly from the actual gear in colour, contents and appearance.",
        ],
      },
      {
        title: "Rental terms",
        body: [
          "Rental periods, the deposit, documents required for pickup and the return procedure are set when the rental is arranged and communicated by the manager.",
        ],
      },
      {
        title: "Checking and caring for the gear",
        body: [
          "On pickup, the customer must check that the gear is complete and undamaged. Any issues must be reported to the manager before handover — once received, the gear is considered accepted in good working order with no claims.",
          "From pickup until return, the customer is fully responsible for the gear. In case of breakage, damage, unusual soiling or loss, the customer pays for repair, cleaning or replacement. The amount may be withheld from the deposit.",
        ],
      },
      {
        title: "Safety",
        body: [
          "Hiking and trips to the mountains involve risks. You assess the weather, the route and your own preparation yourself and are responsible for using the gear safely.",
          "Weather information on the website comes from public sources and is for reference only.",
        ],
      },
      {
        title: "Liability",
        body: [
          "We try to keep the information on the website up to date but do not guarantee it is free of inaccuracies and are not liable for decisions made solely on the basis of the website's content.",
          "The website links to third-party services (Telegram, Instagram); we are not responsible for how they work or for their policies.",
        ],
      },
      {
        title: "Personal data",
        body: [
          "The website does not collect personal data through forms. The details you give the manager when placing an order are used only to contact you and arrange the rental and are not shared with third parties, except as required by the laws of the Republic of Uzbekistan.",
        ],
      },
      {
        title: "Website content",
        body: [
          "The texts, photos, logo and design of the website belong to rentTent or are used with the permission of their owners. Copying without consent is not allowed.",
        ],
      },
      {
        title: "Changes",
        body: [
          "We may update these terms without prior notice. By continuing to use the website, you agree to the current version.",
        ],
      },
    ],
  },
};
