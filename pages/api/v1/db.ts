export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  detail: string;
  description: string;
  image1: string;
  image2: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
  createdAt: string;
}

export const productsDb: ApiProduct[] = [
  {
    id: 100,
    name: "Chaqueta Destiny Softshell",
    price: 65.00,
    detail: "Chaqueta softshell cortavientos y térmica diseñada para dama. Cuenta con costuras reforzadas e impermeabilidad certificada para el sector comercial e institucional.",
    description: "Chaqueta térmica impermeable Destiny Softshell para dama.",
    image1: "/bg-img/female_model.png",
    image2: "/bg-img/female_model.png",
    category: {
      id: 1,
      name: "women",
      description: "Estilos elegantes e institucionales para dama"
    },
    createdAt: "2026-05-20T12:00:00.000Z"
  },
  {
    id: 99,
    name: "Mochila de Asalto Táctico 45L",
    price: 85.00,
    detail: "Mochila táctica de alta resistencia de 45 litros de capacidad con sistema Molle. Ideal para operaciones militares, de seguridad y actividades extremas.",
    description: "Mochila táctica militar con costuras reforzadas e impermeabilidad.",
    image1: "/bg-img/tactical_model.png",
    image2: "/bg-img/tactical_back.png", // Integrated Back View
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-05-19T12:00:00.000Z"
  },
  {
    id: 98,
    name: "Chaqueta Táctica Combat Verde Oliva",
    price: 95.00,
    detail: "Chaqueta táctica militar premium en color verde oliva. Tela de alta resistencia contra rasgaduras, múltiples bolsillos y capucha desmontable.",
    description: "Chaqueta militar de combate verde oliva Destiny.",
    image1: "/bg-img/tactical_model.png",
    image2: "/bg-img/tactical_back.png", // Integrated Back View
    category: {
      id: 3,
      name: "men",
      description: "Prendas casuales y tácticas de alta calidad para caballero"
    },
    createdAt: "2026-05-18T12:00:00.000Z"
  },
  {
    id: 97,
    name: "Chaqueta Destiny Negra Masculina",
    price: 75.00,
    detail: "Chaqueta deportiva cortaviento en color negro. Ajuste ergonómico y tela repelente al agua, perfecta para el uso diario y actividades físicas.",
    description: "Chaqueta cortavientos negra Destiny para caballero.",
    image1: "/bg-img/male_model.png",
    image2: "/bg-img/male_model.png",
    category: {
      id: 3,
      name: "men",
      description: "Prendas casuales y tácticas de alta calidad para caballero"
    },
    createdAt: "2026-05-17T12:00:00.000Z"
  },
  {
    id: 96,
    name: "Chaleco Antibalas Policial III-A",
    price: 280.00,
    detail: "Chaleco antibalas policial con placas de protección nivel III-A certificadas. Ajuste de hombros y cintura con velcro de alta adherencia y forro transpirable.",
    description: "Chaleco antibalas de alta seguridad policial certificado.",
    image1: "/bg-img/police_model.png",
    image2: "/bg-img/police_back.png", // Integrated Back View
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-05-16T12:00:00.000Z"
  },
  {
    id: 95,
    name: "Chaqueta Blazer Slim Noche",
    price: 110.00,
    detail: "Blazer elegante para caballero en corte slim-fit. Confeccionado con lana y forro interno satinado, ideal para eventos de noche o reuniones ejecutivas.",
    description: "Blazer ejecutivo negro slim-fit para caballero.",
    image1: "/bg-img/elegant_model.png",
    image2: "/bg-img/elegant_model.png",
    category: {
      id: 3,
      name: "men",
      description: "Prendas casuales y tácticas de alta calidad para caballero"
    },
    createdAt: "2026-05-15T12:00:00.000Z"
  },
  {
    id: 94,
    name: "Hoodie Buzo Casual Beige",
    price: 45.00,
    detail: "Saco con capucha confeccionado en algodón perchado premium en color beige. Textura ultra suave al tacto y máxima comodidad para el uso diario.",
    description: "Buzo hoodie casual premium beige Destiny.",
    image1: "/bg-img/casual_model.png",
    image2: "/bg-img/casual_back.png", // Integrated Back View
    category: {
      id: 3,
      name: "men",
      description: "Prendas casuales y tácticas de alta calidad para caballero"
    },
    createdAt: "2026-05-14T12:00:00.000Z"
  },
  {
    id: 93,
    name: "Camisa Oxford Administrativa Dama",
    price: 28.00,
    detail: "Camisa ejecutiva de dama confeccionada en tela Oxford premium. Ideal para uniformes administrativos y corporativos con excelente durabilidad y planchado fácil.",
    description: "Camisa Oxford administrativa celeste para dama.",
    image1: "/bg-img/female_model.png",
    image2: "/bg-img/female_model.png",
    category: {
      id: 1,
      name: "women",
      description: "Estilos elegantes e institucionales para dama"
    },
    createdAt: "2026-05-13T12:00:00.000Z"
  }
];
