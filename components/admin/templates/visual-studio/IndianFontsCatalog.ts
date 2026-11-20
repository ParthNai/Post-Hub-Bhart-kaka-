/**
 * Curated Indian Vernacular & Global Fonts Catalog for Post Hub
 * Supports Hindi (Devanagari), Gujarati, Marathi, and English typography.
 */

export interface FontOption {
  id: string;
  name: string;
  category: "Devanagari" | "Gujarati" | "English" | "Display";
  googleFont: string;
  previewText: string;
  weights: string[];
}

export const INDIAN_FONTS_CATALOG: FontOption[] = [
  // Devanagari / Hindi / Marathi Fonts
  {
    id: "noto-sans-devanagari",
    name: "Noto Sans Devanagari",
    category: "Devanagari",
    googleFont: "Noto+Sans+Devanagari:wght@400;600;700;800",
    previewText: "शुभ दीपावली • हार्दिक बधाई",
    weights: ["400", "600", "700", "800"],
  },
  {
    id: "rozha-one",
    name: "Rozha One (Bold Festive)",
    category: "Devanagari",
    googleFont: "Rozha+One",
    previewText: "विजयादशमी की शुभकामनाएं",
    weights: ["400"],
  },
  {
    id: "yatra-one",
    name: "Yatra One (Devotional / Rustic)",
    category: "Devanagari",
    googleFont: "Yatra+One",
    previewText: "जय श्री राम • नूतन वर्ष",
    weights: ["400"],
  },
  {
    id: "baloo-2",
    name: "Baloo 2 (Modern Rounded)",
    category: "Devanagari",
    googleFont: "Baloo+2:wght@500;600;700;800",
    previewText: "विकसित भारत का संकल्प",
    weights: ["500", "600", "700", "800"],
  },
  {
    id: "mukta",
    name: "Mukta (Clean Political)",
    category: "Devanagari",
    googleFont: "Mukta:wght@400;600;700;800",
    previewText: "सबका साथ, सबका विकास",
    weights: ["400", "600", "700", "800"],
  },
  {
    id: "hind",
    name: "Hind (Crisp Editorial)",
    category: "Devanagari",
    googleFont: "Hind:wght@400;600;700",
    previewText: "भारतीय जनता पार्टी",
    weights: ["400", "600", "700"],
  },

  // Gujarati Fonts
  {
    id: "tiro-gujarati",
    name: "Tiro Gujarati (Traditional)",
    category: "Gujarati",
    googleFont: "Tiro+Gujarati",
    previewText: "નૂતન વર્ષાભિનંદન • શુભકામના",
    weights: ["400"],
  },
  {
    id: "noto-sans-gujarati",
    name: "Noto Sans Gujarati",
    category: "Gujarati",
    googleFont: "Noto+Sans+Gujarati:wght@400;600;700;800",
    previewText: "જય હિન્દ • ગુજરાત પ્રદેશ",
    weights: ["400", "600", "700", "800"],
  },
  {
    id: "rasa",
    name: "Rasa (Literary Gujarati)",
    category: "Gujarati",
    googleFont: "Rasa:wght@500;600;700",
    previewText: "આપનું હાર્દિક સ્વાગત છે",
    weights: ["500", "600", "700"],
  },

  // English & Display Fonts
  {
    id: "poppins",
    name: "Poppins (Modern Bold)",
    category: "English",
    googleFont: "Poppins:wght@400;600;700;800;900",
    previewText: "Happy Diwali • Leadership",
    weights: ["400", "600", "700", "800", "900"],
  },
  {
    id: "montserrat",
    name: "Montserrat (Impact Headline)",
    category: "English",
    googleFont: "Montserrat:wght@500;700;800;900",
    previewText: "VIKASIT BHARAT 2026",
    weights: ["500", "700", "800", "900"],
  },
  {
    id: "inter",
    name: "Inter (Neutral Clean)",
    category: "English",
    googleFont: "Inter:wght@400;500;600;700",
    previewText: "Official Candidate Profile",
    weights: ["400", "500", "600", "700"],
  },
  {
    id: "cinzel",
    name: "Cinzel (Royal Gold Elegance)",
    category: "Display",
    googleFont: "Cinzel:wght@600;700;800;900",
    previewText: "FESTIVAL OF LIGHTS",
    weights: ["600", "700", "800", "900"],
  },
];

/**
 * Categorized Ready-to-Insert Slogans & Quotes in Hindi, Gujarati, and English
 */
export interface SloganSnippet {
  id: string;
  category: "Political" | "Festival" | "Patriotic" | "Business";
  language: "Hindi" | "Gujarati" | "English";
  title: string;
  text: string;
}

export const READY_SLOGAN_SNIPPETS: SloganSnippet[] = [
  // Political & Governance
  {
    id: "slogan-pol-1",
    category: "Political",
    language: "Hindi",
    title: "सबका साथ, सबका विकास",
    text: "सबका साथ, सबका विकास, सबका विश्वास",
  },
  {
    id: "slogan-pol-2",
    category: "Political",
    language: "Hindi",
    title: "विकसित भारत का संकल्प",
    text: "विकसित भारत का संकल्प • सशक्त समाज, समृद्ध राष्ट्र",
  },
  {
    id: "slogan-pol-3",
    category: "Political",
    language: "Hindi",
    title: "एक भारत श्रेष्ठ भारत",
    text: "एक भारत श्रेष्ठ भारत • सेवा, सुशासन और गरीब कल्याण",
  },
  {
    id: "slogan-pol-guj-1",
    category: "Political",
    language: "Gujarati",
    title: "વિશ્વાસ અને વિકાસની રાજનીતિ",
    text: "સાથે મળીને કરીશું સર્વાંગી વિકાસ • ગુજરાત પ્રથમ",
  },

  // Festival Greetings
  {
    id: "slogan-fest-1",
    category: "Festival",
    language: "Hindi",
    title: "दीपावली की शुभकामनाएं",
    text: "दीपावली का पावन पर्व आपके जीवन में सुख, समृद्धि और आरोग्य लाए।",
  },
  {
    id: "slogan-fest-2",
    category: "Festival",
    language: "Hindi",
    title: "विजयदशमी की बधाई",
    text: "असत्य पर सत्य की विजय के पावन पर्व विजयादशमी की हार्दिक शुभकामनाएं।",
  },
  {
    id: "slogan-fest-guj-1",
    category: "Festival",
    language: "Gujarati",
    title: "દિવાળી અને નૂતન વર્ષ",
    text: "દિવાળી અને બેસતા વર્ષની આપ સર્વેને હાર્દિક શુભકામનાઓ!",
  },
  {
    id: "slogan-fest-eng-1",
    category: "Festival",
    language: "English",
    title: "Happy Diwali Blessing",
    text: "May the divine light of Diwali bring peace, prosperity, and happiness in everyone's life.",
  },

  // Patriotic & Nation
  {
    id: "slogan-pat-1",
    category: "Patriotic",
    language: "Hindi",
    title: "जय हिन्द, वन्दे मातरम्",
    text: "जय हिन्द • वन्दे मातरम् • भारत माता की जय",
  },
  {
    id: "slogan-pat-2",
    category: "Patriotic",
    language: "Hindi",
    title: "गणतंत्र दिवस की शुभकामनाएं",
    text: "समस्त देशवासियों को गणतंत्र दिवस की कोटि-कोटि शुभकामनाएं।",
  },

  // Business & Enterprise
  {
    id: "slogan-biz-1",
    category: "Business",
    language: "English",
    title: "Grand Opening / Festive Offer",
    text: "Exclusive Festive Offer • Up to 50% Off On All Collections",
  },
  {
    id: "slogan-biz-2",
    category: "Business",
    language: "Hindi",
    title: "व्यापारिक शुभकामना",
    text: "नये प्रतिष्ठान के शुभारंभ पर आप सभी का हार्दिक स्वागत एवं अभिनंदन।",
  },
];
