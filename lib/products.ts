// REEMPLAZA tu lib/products.ts con este archivo
// Cambios: agregado campo imageUrl que apunta a /images/producto-[slug].jpg

export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  benefits: string[];
  usage: string;
  ingredients: string[];
  price: number;
  comparePrice?: number;
  stock: number;
  badge?: string;
  highlight?: string;
  imageUrl: string;
};

export const products: Product[] = [
  {
    slug: "fortis-whey-cacao",
    name: "Fortis Whey · Cacao Andino",
    category: "Proteínas",
    tagline: "Proteína de suero aislada con cacao colombiano",
    description:
      "Mezcla de proteína de suero aislada premium con cacao orgánico cultivado en el Cauca. Cada porción aporta 26 g de proteína de alta biodisponibilidad, baja en lactosa y sin azúcar añadida. Diseñada para deportistas que buscan recuperación muscular con un perfil de sabor profundo y nada empalagoso.",
    benefits: [
      "26 g de proteína por porción",
      "Cacao orgánico de origen Cauca",
      "Sin azúcar añadida, baja en lactosa",
      "Recuperación post-entreno",
    ],
    usage: "Mezclar 1 medida (32 g) con 250 ml de agua o leche vegetal. Consumir después del entrenamiento o como complemento de desayuno.",
    ingredients: [
      "Aislado de proteína de suero",
      "Cacao orgánico desgrasado",
      "Lecitina de girasol",
      "Sucralosa",
      "Sal marina",
    ],
    price: 189000,
    comparePrice: 215000,
    stock: 48,
    badge: "Más vendido",
    highlight: "26g proteína",
    imageUrl: "/images/producto-fortis-whey-cacao.jpg",
  },
  {
    slug: "kinetic-creatina-monohidrato",
    name: "Kinetic · Creatina Monohidrato",
    category: "Rendimiento",
    tagline: "Creatina micronizada 99.9% de pureza",
    description:
      "Creatina monohidrato micronizada con certificación de pureza independiente. Aumenta la fuerza, la potencia y el volumen muscular en entrenamientos de alta intensidad. Sin sabor, mezcla instantánea, sin aditivos innecesarios.",
    benefits: [
      "99.9% pureza certificada",
      "Aumenta fuerza y potencia",
      "Disolución instantánea",
      "Sin sabor ni aditivos",
    ],
    usage: "5 g diarios disueltos en agua o jugo. No requiere fase de carga. Mantener consumo constante para beneficios óptimos.",
    ingredients: ["Creatina monohidrato micronizada (100%)"],
    price: 119000,
    stock: 92,
    highlight: "Pureza 99.9%",
    imageUrl: "/images/producto-kinetic-creatina-monohidrato.jpg",
  },
  {
    slug: "verda-greens-detox",
    name: "Verda Greens · Mezcla Verde Diaria",
    category: "Bienestar",
    tagline: "Superalimentos verdes en una sola cucharada",
    description:
      "Combinación de 12 vegetales y algas en polvo: espirulina, chlorella, moringa, espinaca, brócoli y más. Aporta antioxidantes, fibra y micronutrientes que normalmente faltan en la dieta diaria. Sabor a manzana verde y menta para que sea fácil de tomar todos los días.",
    benefits: [
      "12 superalimentos verdes",
      "Rico en antioxidantes",
      "Apoya energía y digestión",
      "Sabor manzana-menta",
    ],
    usage: "1 cucharada (8 g) en 200 ml de agua fría. Tomar en ayunas o entre comidas.",
    ingredients: [
      "Espirulina",
      "Chlorella",
      "Moringa",
      "Espinaca deshidratada",
      "Brócoli en polvo",
      "Hierba de trigo",
      "Manzana verde liofilizada",
      "Hojas de menta",
      "Inulina",
      "Stevia",
    ],
    price: 145000,
    stock: 31,
    badge: "Nuevo",
    imageUrl: "/images/producto-verda-greens-detox.jpg",
  },
  {
    slug: "noxen-pre-entreno",
    name: "Noxen · Pre-Entreno Avanzado",
    category: "Rendimiento",
    tagline: "Energía sostenida sin colapso posterior",
    description:
      "Fórmula pre-entreno con cafeína de liberación dual, beta-alanina, L-citrulina y taurina. Diseñada para entrenamientos largos donde necesitas energía estable sin el típico bajón. Sabor sandía-lima refrescante.",
    benefits: [
      "Energía dual de 4 horas",
      "Mejora bombeo muscular",
      "Aumenta resistencia",
      "Sin crash posterior",
    ],
    usage: "1 medida (12 g) con 300 ml de agua, 20-30 minutos antes del entrenamiento. No exceder 1 porción al día.",
    ingredients: [
      "L-Citrulina malato",
      "Beta-alanina",
      "Cafeína anhidra",
      "Cafeína microencapsulada",
      "Taurina",
      "Tirosina",
      "Extracto de té verde",
    ],
    price: 165000,
    comparePrice: 189000,
    stock: 22,
    highlight: "Energía 4h",
    imageUrl: "/images/producto-noxen-pre-entreno.jpg",
  },
  {
    slug: "soma-magnesio-glicinato",
    name: "Soma · Magnesio Glicinato",
    category: "Recuperación",
    tagline: "Recuperación muscular y sueño profundo",
    description:
      "Magnesio en forma de glicinato, la más biodisponible y suave para el sistema digestivo. Apoya la recuperación muscular nocturna, reduce calambres y mejora la calidad del sueño profundo. Cápsulas vegetales.",
    benefits: [
      "Forma altamente biodisponible",
      "Mejora calidad del sueño",
      "Reduce calambres",
      "Cápsula vegetal",
    ],
    usage: "2 cápsulas 30 minutos antes de dormir, con agua. Puede aumentarse a 3 cápsulas en períodos de entrenamiento intenso.",
    ingredients: [
      "Magnesio bisglicinato (400 mg elemental)",
      "Cápsula vegetal HPMC",
    ],
    price: 89000,
    stock: 64,
    imageUrl: "/images/producto-soma-magnesio-glicinato.jpg",
  },
  {
    slug: "lumen-omega-3-marino",
    name: "Lumen · Omega-3 Marino",
    category: "Bienestar",
    tagline: "EPA + DHA de aceite de pescado purificado",
    description:
      "Aceite de pescado destilado molecularmente, con ratio óptimo de EPA y DHA por cápsula. Sin regusto a pescado gracias a un proceso de purificación de 5 etapas. Apoya salud cardiovascular, cerebral y articular.",
    benefits: [
      "1000 mg EPA+DHA por porción",
      "Sin regusto a pescado",
      "Apoyo cardiovascular",
      "Destilado molecularmente",
    ],
    usage: "2 cápsulas diarias con una comida que contenga grasa para mejor absorción.",
    ingredients: [
      "Aceite de pescado concentrado",
      "EPA 600 mg",
      "DHA 400 mg",
      "Vitamina E (antioxidante)",
      "Cápsula de gelatina marina",
    ],
    price: 132000,
    stock: 55,
    imageUrl: "/images/producto-lumen-omega-3-marino.jpg",
  },
  {
    slug: "aurum-multivitaminico",
    name: "Aurum · Multivitamínico Completo",
    category: "Bienestar",
    tagline: "23 micronutrientes en una cápsula diaria",
    description:
      "Multivitamínico de espectro completo con vitaminas A, C, D3, E, K2, complejo B activado y minerales quelados para máxima absorción. Formulado para personas activas con altos requerimientos nutricionales.",
    benefits: [
      "23 nutrientes esenciales",
      "Formas activadas de vitaminas B",
      "Minerales quelados",
      "Una cápsula al día",
    ],
    usage: "1 cápsula con el desayuno. Mantener consumo diario para resultados sostenidos.",
    ingredients: [
      "Vitamina A, C, D3, E, K2",
      "Complejo B (B1, B2, B3, B5, B6, B7, B9, B12)",
      "Zinc, magnesio, selenio, cromo",
      "Quelatos de glicina",
    ],
    price: 108000,
    stock: 78,
    imageUrl: "/images/producto-aurum-multivitaminico.jpg",
  },
  {
    slug: "veloz-bcaa-recovery",
    name: "Veloz · BCAA Recovery",
    category: "Recuperación",
    tagline: "Aminoácidos ramificados en ratio 2:1:1",
    description:
      "BCAAs en ratio 2:1:1 (leucina, isoleucina, valina) con electrolitos añadidos para hidratación. Ideal para tomar durante el entrenamiento o en cardio en ayunas. Sabor frutos rojos.",
    benefits: [
      "Ratio óptimo 2:1:1",
      "Con electrolitos",
      "Reduce fatiga muscular",
      "Sabor frutos rojos",
    ],
    usage: "1 medida (10 g) en 500 ml de agua durante el entrenamiento.",
    ingredients: [
      "L-Leucina",
      "L-Isoleucina",
      "L-Valina",
      "Sodio, potasio, magnesio",
      "Saborizante natural frutos rojos",
    ],
    price: 142000,
    stock: 37,
    imageUrl: "/images/producto-veloz-bcaa-recovery.jpg",
  },
];

export const categories = [
  { slug: "proteinas", name: "Proteínas", count: 1 },
  { slug: "rendimiento", name: "Rendimiento", count: 2 },
  { slug: "recuperacion", name: "Recuperación", count: 2 },
  { slug: "bienestar", name: "Bienestar", count: 3 },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
