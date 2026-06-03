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
  colors: string[];
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
    createdAt: "2026-05-20T12:00:00.000Z",
    colors: ["#4B5320", "#000000"]
  },
  {
    id: 99,
    name: "Mochila de Asalto Táctico 45L",
    price: 85.00,
    detail: "Mochila táctica de alta resistencia de 45 litros de capacidad con sistema Molle. Ideal para operaciones militares, de seguridad y actividades extremas.",
    description: "Mochila táctica militar con costuras reforzadas e impermeabilidad.",
    image1: "/bg-img/tactical_model.png",
    image2: "/bg-img/tactical_back.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-05-19T12:00:00.000Z",
    colors: ["#000000", "#4B5320", "#D2B48C"]
  },
  {
    id: 98,
    name: "Chaqueta Táctica Combat Verde Oliva",
    price: 95.00,
    detail: "Chaqueta táctica militar premium en color verde oliva. Tela de alta resistencia contra rasgaduras, múltiples bolsillos y capucha desmontable.",
    description: "Chaqueta militar de combate verde oliva Destiny.",
    image1: "/bg-img/tactical_model.png",
    image2: "/bg-img/tactical_back.png",
    category: {
      id: 3,
      name: "men",
      description: "Prendas casuales y tácticas de alta calidad para caballero"
    },
    createdAt: "2026-05-18T12:00:00.000Z",
    colors: ["#4B5320"]
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
    createdAt: "2026-05-17T12:00:00.000Z",
    colors: ["#000000"]
  },
  {
    id: 96,
    name: "Chaleco Antibalas Policial III-A",
    price: 280.00,
    detail: "Chaleco antibalas policial con placas de protección nivel III-A certificadas. Ajuste de hombros y cintura con velcro de alta adherencia y forro transpirable.",
    description: "Chaleco antibalas de alta seguridad policial certificado.",
    image1: "/bg-img/police_model.png",
    image2: "/bg-img/police_back.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-05-16T12:00:00.000Z",
    colors: ["#000000", "#4B5320"]
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
    createdAt: "2026-05-15T12:00:00.000Z",
    colors: ["#000000"]
  },
  {
    id: 94,
    name: "Hoodie Buzo Casual Beige",
    price: 45.00,
    detail: "Saco con capucha confeccionado en algodón perchado premium en color beige. Textura ultra suave al tacto y máxima comodidad para el uso diario.",
    description: "Buzo hoodie casual premium beige Destiny.",
    image1: "/bg-img/casual_model.png",
    image2: "/bg-img/casual_back.png",
    category: {
      id: 3,
      name: "men",
      description: "Prendas casuales y tácticas de alta calidad para caballero"
    },
    createdAt: "2026-05-14T12:00:00.000Z",
    colors: ["#D2B48C", "#000000"]
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
    createdAt: "2026-05-13T12:00:00.000Z",
    colors: ["#E0F2FE", "#FFFFFF"]
  },
  // Novedades / Catálogo Militar y Camping
  {
    id: 101,
    name: "Tula Mochila",
    price: 55.00,
    detail: "100% Lona resistente. Impermeable. Correas de comprensión laterales, para poder cargar tipo mochila. Compartimientos laterales y frontales con cierre. Divisiones internas removibles.",
    description: "Tula de lona táctica de alta resistencia, convertible en mochila con diseño impermeable.",
    image1: "/bg-img/tula_mochila.png",
    image2: "/bg-img/tula_mochila.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:00:00.000Z",
    colors: ["#4B5320", "#000000", "#D2B48C"]
  },
  {
    id: 102,
    name: "Pintura Camuflaje",
    price: 12.00,
    detail: "Camuflaje en tubo. Tipo americano. Incluye dos colores.",
    description: "Tubo de pintura de enmascaramiento facial tipo americano, incluye dos colores de excelente resistencia al sudor.",
    image1: "/bg-img/pintura_camuflaje.png",
    image2: "/bg-img/pintura_camuflaje.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:01:00.000Z",
    colors: ["#4B5320", "#C3B091"]
  },
  {
    id: 103,
    name: "Camelbak",
    price: 35.00,
    detail: "Capacidad 2.5 litros. Exterior en cordura reforzada. Contenedor interno en goma antibacteriana. Cierre hermético - amplio. Bolsillo trasero que hace inspeccionable el contenedor. Gancho clip para cuerpo. Manguera de goma para transporte de agua con fundas de lona verde.",
    description: "Sistema de hidratación Camelbak táctico de 2.5 litros con manguera protegida y arnés ajustable.",
    image1: "/bg-img/camelbak.png",
    image2: "/bg-img/camelbak.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:02:00.000Z",
    colors: ["#4B5320", "#000000", "#D2B48C"]
  },
  {
    id: 104,
    name: "Carpa Iglú Táctica",
    price: 120.00,
    detail: "Políester impermeable, con bolsa transportadora. Para 2 personas. Malla en parte superior para ingreso de aire. En las 4 puntas tendrá un sujetador al piso. Armazón compuesta por palitroques desarmable. Anclas al piso metalizado para sujeción. Dimensiones aprox. 1,80x1,80m.",
    description: "Carpa de campaña tipo iglú de ensamble rápido con anclas de metal y costuras selladas.",
    image1: "/bg-img/carpa_iglu_tactica.png",
    image2: "/bg-img/carpa_iglu_tactica.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:03:00.000Z",
    colors: ["#4B5320", "#D2B48C"]
  },
  {
    id: 105,
    name: "Colchonetas de Campañas",
    price: 25.00,
    detail: "Fabricado en suela, reata y bucle plástico para ajuste para transporte. Dimensiones 0,70x1,90m. Espesor de 0,7 mm.",
    description: "Colchoneta de campaña impermeable, ligera y fácil de enrollar.",
    image1: "/bg-img/colchonetas_Campaña.png",
    image2: "/bg-img/colchonetas_Campaña.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:04:00.000Z",
    colors: ["#4B5320", "#000000", "#C3B091"]
  },
  {
    id: 106,
    name: "Machete Tipo Comando con Vaina",
    price: 45.00,
    detail: "Machete: Machete de acero comando. Hoja de metal con largo 15 pulgada. Mango negro plástico. Con sierra en parte anterior. Vaina: Para machete estilo comando. Tela nylon. Pasador de lona en el extremo.",
    description: "Machete táctico comando de acero negro de 15 pulgadas con sierra superior y funda protectora.",
    image1: "/bg-img/machete_comando_vaina.png",
    image2: "/bg-img/machete_comando_vaina_1.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:05:00.000Z",
    colors: ["#000000", "#4B5320"]
  },
  {
    id: 107,
    name: "Mosquetón en D",
    price: 15.00,
    detail: "Acero. En forma de D, más funcional para conectar un sistema de aseguramiento o llevar el material. Ergonomía y sistema Keylock. Certificaciones: CE EN 362, NFPA 2500 General Use, EAC GB/T 23469-2009 XF 494-2004.",
    description: "Mosquetón táctico de acero en D con certificación CE y sistema de traba segura Keylock.",
    image1: "/bg-img/mosqueton_d.png",
    image2: "/bg-img/mosqueton_d.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:06:00.000Z",
    colors: ["#000000", "#4B5320", "#C3B091"]
  },
  {
    id: 108,
    name: "Mochila de Campaña",
    price: 110.00,
    detail: "Mochila de Nylon americana, resistente e impermeable. Tres bolsillos (2 laterales y 1 frontal). Espaldar acolchado. Compartimento principal con capacidad de 80 l. Los bolsillos se ajustarán con correas y pasadores, los broches y hebillas son metálicos.",
    description: "Mochila táctica de campaña de 80 litros para expedición, construida con nylon de especificación militar.",
    image1: "/bg-img/mochila_campaña.png",
    image2: "/bg-img/mochila_campaña.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:07:00.000Z",
    colors: ["#4B5320", "#000000", "#D2B48C"]
  },
  {
    id: 109,
    name: "Poncho de Aguas",
    price: 28.00,
    detail: "Poncho de agua con capucha. Nylon impermeable. Debe llegar hasta debajo de las rodillas. Táctico sin mangas.",
    description: "Poncho táctico impermeable de nylon diseñado para cubrir equipamiento y personal en condiciones extremas.",
    image1: "/bg-img/poncho_aguas.png",
    image2: "/bg-img/poncho_aguas.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:08:00.000Z",
    colors: ["#4B5320", "#000000", "#D2B48C"]
  },
  {
    id: 110,
    name: "Tapones Auditivos",
    price: 5.00,
    detail: "Tapones sin cordón. Espuma blanda de poliuretano hipoalergénica. Diseño Cónico.",
    description: "Tapones auditivos desechables hipoalergénicos de diseño ergonómico y alta reducción de ruido.",
    image1: "/bg-img/tapones_auditivos.png",
    image2: "/bg-img/tapones_auditivos.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:09:00.000Z",
    colors: ["#F5B461", "#D2B48C"]
  },
  {
    id: 111,
    name: "Eslinga",
    price: 32.00,
    detail: "Tipo semiestática. Grosor 11 mm. 5m de longitud. Certificación CE EN 1891 tipo A, UKCA, NFPA 1983 uso táctico. Color oscuro.",
    description: "Eslinga semiestática reforzada de 11mm para usos tácticos de descenso y sujeción.",
    image1: "/bg-img/eslinga.png",
    image2: "/bg-img/eslinga.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:10:00.000Z",
    colors: ["#000000", "#4B5320"]
  },
  {
    id: 112,
    name: "Vajilla de Campaña con Morral",
    price: 30.00,
    detail: "Vajilla: De aluminio. Tipo Militar. Tamaño estándar. Incluye tres piezas: sopa, arroz y jugo. Morral: Material lona reforzada. Tamaño estándar para vajilla.",
    description: "Set de vajilla militar de aluminio ultraligero con morral de lona para transporte.",
    image1: "/bg-img/vajilla_campaña_morral.png",
    image2: "/bg-img/vajilla_campaña_morral_1.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:11:00.000Z",
    colors: ["#4B5320", "#000000"]
  },
  {
    id: 113,
    name: "Sleeping",
    price: 65.00,
    detail: "Compacto y portátil. El saco de dormir de algodón ultraligero, se puede guardar en un pequeño paquete de 22x43cm y pesa solo 1,3kg. Tamaño del saco desplegado es de 220x85cm. Aplicable a temperatura de menos de 5°C.",
    description: "Saco de dormir sleeping ultraligero y térmico ideal para acampar en climas fríos.",
    image1: "/bg-img/sleeping.png",
    image2: "/bg-img/sleeping.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:12:00.000Z",
    colors: ["#4B5320", "#000000", "#D2B48C"]
  },
  {
    id: 114,
    name: "Chaleco de Combate",
    price: 75.00,
    detail: "Lona con malla. Correas laterales que permiten personalizar ajustar garantizando cómodo y seguro. La parte trasera del chaleco está diseñada con una malla que mejora la ventilación. La cremallera frontal facilita ponerse y quitarse el chaleco.",
    description: "Chaleco de combate táctico de lona gruesa y malla transpirable, con múltiples portacargadores.",
    image1: "/bg-img/chaleco_combate.png",
    image2: "/bg-img/chaleco_combate.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:13:00.000Z",
    colors: ["#4B5320", "#000000", "#D2B48C"]
  },
  {
    id: 115,
    name: "Linterna de Cabeza",
    price: 18.00,
    detail: "Funciona con pilas AA. Construcción resistente al agua. IPX4 que soporta salpicaduras. 3 modos de luz. Luz blanca y roja. Banda elástica lavable. Cabezal giratorio para dirigir la luz.",
    description: "Linterna frontal de cabeza táctica, resistente al agua y con modos de luz duales para operaciones nocturnas.",
    image1: "/bg-img/linterna_Cabeza.png",
    image2: "/bg-img/linterna_Cabeza.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:14:00.000Z",
    colors: ["#000000", "#4B5320"]
  },
  {
    id: 116,
    name: "Kit Primeros Auxilios",
    price: 40.00,
    detail: "Morral de 20x20cm. Tiene correa de nylon ajustable. Incluye: 1 torniquete, 2 venda elástica, 2 vendas rígidas, 1 venda triangular, 1 cánula nasofaríngea, 1 tijera cortatodo y 1 manta térmica.",
    description: "Botiquín táctico compacto de primeros auxilios en morral de nylon militar.",
    image1: "/bg-img/kit_primeros_auxilios.png",
    image2: "/bg-img/kit_primeros_auxilios.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:15:00.000Z",
    colors: ["#4B5320", "#000000", "#D2B48C"]
  },
  {
    id: 117,
    name: "Juego de Cubiertos con Portacubierto",
    price: 12.00,
    detail: "Portacubiertos: Sintético de nylon. Capacidad para guardar 4 cubiertos. Cubiertos: Incluye: cuchara, tenedor, cuchillo, cuchara de postre. Acero Inoxidable.",
    description: "Juego de cubiertos de camping en acero inoxidable con funda táctica de nylon.",
    image1: "/bg-img/juego_cubiertos_portacubierto.png",
    image2: "/bg-img/juego_cubiertos_portacubierto.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:16:00.000Z",
    colors: ["#4B5320", "#000000"]
  },
  {
    id: 118,
    name: "Brújula Tipo Deportiva",
    price: 14.00,
    detail: "Tipo deportiva para competencias de orientación. Agujas y flechas con fosforescentes para la oscuridad.",
    description: "Brújula deportiva de alta precisión con marcas fosforescentes para lectura en total oscuridad.",
    image1: "/bg-img/brujula_deportiva.png",
    image2: "/bg-img/brujula_deportiva.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:17:00.000Z",
    colors: ["#000000", "#D2B48C"]
  },
  {
    id: 119,
    name: "Silla Táctica",
    price: 24.00,
    detail: "Silla táctica tipo militar. Lona. Patas de hierro cruzadas fáciles de plegar y desplegar. Soporta un peso de 100 kg.",
    description: "Silla plegable militar de lona y estructura de acero reforzada de fácil transporte.",
    image1: "/bg-img/silla_tactica.png",
    image2: "/bg-img/silla_tactica.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:18:00.000Z",
    colors: ["#4B5320", "#000000"]
  },
  {
    id: 120,
    name: "Tela Paraguas",
    price: 18.00,
    detail: "Material de Nylon impermeable. Medidas 1,5m x 2m.",
    description: "Lona o toldo impermeable de nylon multiusos para refugio y camping.",
    image1: "/bg-img/tela_paraguas.png",
    image2: "/bg-img/tela_paraguas.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:19:00.000Z",
    colors: ["#4B5320", "#000000", "#D2B48C"]
  },
  {
    id: 121,
    name: "Pasamontañas",
    price: 10.00,
    detail: "Tejido de punto fino. Con abertura para los ojos, la boca y la nariz. Material de 100% algodón. Color verde oliva.",
    description: "Pasamontañas de algodón verde oliva con aberturas anatómicas y tejido de punto cómodo.",
    image1: "/bg-img/pasamontañas.png",
    image2: "/bg-img/pasamontañas.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:20:00.000Z",
    colors: ["#4B5320", "#000000"]
  },
  {
    id: 122,
    name: "Sombrero Selva",
    price: 15.00,
    detail: "Tela Gabardina. Bisel de 5cm de ancho. Cordón para la sujeción del mismo en el cuello. Composición según Norma AATCC 2D-1995; 50 +/- 5% Poliéster.",
    description: "Sombrero militar tipo jungla con gabardina de alta resistencia y cordón ajustable.",
    image1: "/bg-img/sombrero_selva.png",
    image2: "/bg-img/sombrero_selva.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:21:00.000Z",
    colors: ["#4B5320", "#C3B091", "#000000"]
  },
  {
    id: 123,
    name: "Guly Pixelada",
    price: 38.00,
    detail: "Tela de lana gruesa. Composición de 65% acrílico y 35% de algodón. Tejido tipo resorte toda la prenda. Cuello redondo. Manga larga. Sobre los hombros, en la sisa y en los codos lleva parches de tela verde oliva sobrecosidos.",
    description: "Suéter tipo Guly de combate pixelado con parches sobrecosidos en hombros y codos.",
    image1: "/bg-img/guly_pixelada.png",
    image2: "/bg-img/guly_pixelada.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:22:00.000Z",
    colors: ["#4B5320", "#D2B48C"]
  },
  {
    id: 124,
    name: "Casco Táctico",
    price: 95.00,
    detail: "Correa de barbilla ajustable para garantizar la estabilidad NVG. Almohadillas modulares de esponja gruesa. Hecho de material plástico ABS de ingeniería ligero de 0.098 in de grosor, solo 1.2 lb. Agujeros de ventilación y un diseño geométrico. Paneles de velcro para instalación de parches.",
    description: "Casco táctico militar liviano con rieles laterales, montura frontal NVG y paneles de velcro.",
    image1: "/bg-img/casco_tactico.png",
    image2: "/bg-img/casco_tactico.png",
    category: {
      id: 2,
      name: "bags",
      description: "Equipamiento de alta gama para táctica y seguridad"
    },
    createdAt: "2026-06-01T08:23:00.000Z",
    colors: ["#4B5320", "#000000", "#D2B48C"]
  }
];
