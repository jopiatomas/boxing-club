export type NavigationItem = {
  label: string;
  href: string;
};

export type Program = {
  name: string;
  level: string;
  description: string;
};

export type ScheduleItem = {
  shift: string;
  hours: string;
  coach: string;
};

export type ExperienceItem = {
  title: string;
  description: string;
  tone: "accent" | "dark";
};

export type Stat = {
  value: string;
  label: string;
  detail: string;
};

export type TrainingVideo = {
  title: string;
  description: string;
  youtubeId: string;
  publishedAt: string;
  duration: string;
  category: string;
  trainingType: "entrenamiento" | "guanteo";
};

export type SiteContent = {
  navigation: NavigationItem[];
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    badges: string[];
  };
  stats: Stat[];
  story: {
    eyebrow: string;
    title: string;
    description: string;
    quote: string;
  };
  programs: Program[];
  schedule: ScheduleItem[];
  experience: ExperienceItem[];
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  footer: {
    copy: string;
    links: NavigationItem[];
  };
  videosPage: {
    eyebrow: string;
    title: string;
    description: string;
    helper: string;
  };
  trainingVideos: TrainingVideo[];
};

export const siteContent: SiteContent = {
  navigation: [
    { label: "Contacto", href: "/#contacto" },
    { label: "Horarios", href: "/#horarios" },
    { label: "Inicio", href: "/#inicio" },
    { label: "Entrenador", href: "/#metodo" },
    { label: "Programas", href: "/#programas" },
    { label: "Espacio", href: "/#espacio" },
    { label: "Videos", href: "/videos" },
  ],
  hero: {
    eyebrow: "Piki Team Boxing Club",
    title: "Entrená con identidad. peleá con criterio.",
    description:
      "Una landing de gimnasio inspirada en el contraste de las editoriales deportivas clásicas, con una presencia cruda, directa y sin color accesorio. Todo el contenido visual está listo para que después reemplaces textos e imágenes reales.",
    primaryCta: "Reservar clase de prueba",
    secondaryCta: "Ver programas",
    badges: ["Boxeo recreativo", "Preparación física", "Clases técnicas"],
  },
  stats: [
    {
      value: "01",
      label: "Metodología clara",
      detail: "Técnica, condición y disciplina en cada clase.",
    },
    {
      value: "02",
      label: "Niveles mixtos",
      detail: "Espacio para principiantes, intermedios y competidores.",
    },
    {
      value: "03",
      label: "Identidad de club",
      detail: "Una marca fuerte para comunidad, eventos y contenido.",
    },
  ],
  story: {
    eyebrow: "Método",
    title: "Un gimnasio con tono de club, no sólo de salón de entrenamiento.",
    description:
      "La propuesta visual mezcla bloques de alto contraste, titulares cortos y secciones con ritmo editorial. La propuesta de producto está enfocada en transmitir prestigio, cercanía y acción.",
    quote:
      "Acá podés contar la historia de Piki Team: cuándo nació, qué valores tiene, a quién entrena y qué lo diferencia dentro de tu ciudad.",
  },
  programs: [
    {
      name: "Fundamentos",
      level: "Ideal para empezar",
      description:
        "Guardia, desplazamientos, golpes básicos, coordinación y primeros trabajos en bolsa.",
    },
    {
      name: "Boxeo Fitness",
      level: "Condición física",
      description:
        "Circuitos intensos con rounds, manoplas, abdominales y trabajo aeróbico.",
    },
    {
      name: "Competencia",
      level: "Plan avanzado",
      description:
        "Sparring técnico, estrategia de pelea, preparación física específica y seguimiento.",
    },
    {
      name: "Clases privadas",
      level: "Atención 1 a 1",
      description:
        "Sesiones personalizadas para objetivos concretos, técnica o puesta a punto.",
    },
  ],
  schedule: [
    {
      shift: "Mañana",
      hours: "08:30 - 10:30",
      coach: "Técnica general y bolsa",
    },
    {
      shift: "Tarde",
      hours: "15:00 / 16:30 / 18:00",
      coach: `"Piki" Delacroix`,
    },
    {
      shift: "Noche",
      hours: "19:30 - 21:00",
      coach: `"Piki" Delacroix`,
    },
  ],
  experience: [
    {
      title: "Acá iría una imagen principal del gimnasio",
      description:
        "Usé un bloque grande para que después puedas poner una foto hero de la sala, el ring o una clase.",
      tone: "accent",
    },
    {
      title: "Acá iría una foto del equipo o entrenador",
      description:
        "Este bloque funciona bien para reforzar autoridad, mostrar coaching o destacar una historia.",
      tone: "dark",
    },
    {
      title: "Acá iría una foto de entrenamiento",
      description:
        "Pensado para sumar movimiento visual y bajar el tono institucional con algo más humano.",
      tone: "dark",
    },
  ],
  contact: {
    address: "Acá va la dirección real del gimnasio",
    phone: "Acá va tu teléfono",
    email: "Acá va tu email",
    hours: "Lunes a sábado, horarios a definir",
  },
  footer: {
    copy: "Base hecha con React y Tailwind CSS, organizada para que puedas estudiar la estructura, modificar contenido y seguir escalando el proyecto.",
    links: [
      { label: "Inicio", href: "/#inicio" },
      { label: "Programas", href: "/#programas" },
      { label: "Videos", href: "/videos" },
      { label: "Contacto", href: "/#contacto" },
    ],
  },
  videosPage: {
    eyebrow: "Videos de entrenamiento",
    title:
      "Biblioteca de sesiones para seguir el ritmo del club fuera del gimnasio.",
    description:
      "La mejor estructura es usar YouTube como hosting y descubrimiento, pero guardar en tu app los metadatos de cada video. Así podés ordenarlos por semana, separar entrenamientos de guanteos y destacar contenido nuevo sin depender de la interfaz de YouTube.",
    helper:
      "Agrupar por semana y tipo te da una lectura mucho más cercana a la rutina real del club. El usuario entiende rápido qué corresponde a trabajo técnico y qué corresponde a guanteo.",
  },
  trainingVideos: [
    {
      title: "Trabajo de guardia y desplazamientos",
      description:
        "Sesión enfocada en base, pasos cortos y corrección de postura para principiantes e intermedios.",
      youtubeId: "kPa7bsKwL-c",
      publishedAt: "2026-03-18",
      duration: "12 min",
      category: "Técnica",
      trainingType: "entrenamiento",
    },
    {
      title: "Guanteo de presión para rounds cortos",
      description:
        "Rounds breves con foco en presión, respuesta y sostén del ritmo frente a un rival activo.",
      youtubeId: "g2oe3P0o3mQ",
      publishedAt: "2026-03-08",
      duration: "16 min",
      category: "Guanteo",
      trainingType: "guanteo",
    },
    {
      title: "Manoplas: combinaciones simples",
      description:
        "Secuencia de jab, cross y salida lateral para repetir en casa o repasar antes de clase.",
      youtubeId: "dQw4w9WgXcQ",
      publishedAt: "2026-02-21",
      duration: "10 min",
      category: "Manoplas",
      trainingType: "entrenamiento",
    },
    {
      title: "Guanteo técnico con control de distancia",
      description:
        "Trabajo liviano para entrenar lectura, pasos y elección de golpes sin perder orden defensivo.",
      youtubeId: "mlVrkiCoKkg",
      publishedAt: "2026-02-12",
      duration: "18 min",
      category: "Guanteo",
      trainingType: "guanteo",
    },
    {
      title: "Acondicionamiento para boxeo",
      description:
        "Circuito con sombra, abdominales y tren inferior para sostener ritmo de combate.",
      youtubeId: "BaW_jenozKc",
      publishedAt: "2026-02-12",
      duration: "18 min",
      category: "Preparación física",
      trainingType: "entrenamiento",
    },
    {
      title: "Sombra guiada para entrar en calor",
      description:
        "Entrada en calor breve para activar hombros, cadera y coordinación antes de entrenar.",
      youtubeId: "sTANio_2E0Q",
      publishedAt: "2026-01-29",
      duration: "8 min",
      category: "Entrada en calor",
      trainingType: "entrenamiento",
    },
    {
      title: "Guanteo suave con foco defensivo",
      description:
        "Intercambio controlado para practicar bloqueos, esquives y salidas sin perder la guardia.",
      youtubeId: "jNQXAC9IVRw",
      publishedAt: "2026-01-14",
      duration: "14 min",
      category: "Guanteo",
      trainingType: "guanteo",
    },
    {
      title: "Defensa básica: bloqueos y esquives",
      description:
        "Repaso técnico de defensas iniciales con progresión simple y foco en timing.",
      youtubeId: "M7lc1UVf-VE",
      publishedAt: "2026-01-14",
      duration: "14 min",
      category: "Defensa",
      trainingType: "entrenamiento",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "UuYBvZQSbq4",
      publishedAt: "2026-04-02",
      duration: "3 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "I4qLIx5h8-w",
      publishedAt: "2026-04-02",
      duration: "3,12 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "mQFylEx79g4",
      publishedAt: "2026-04-02",
      duration: "3,12 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "pxseXVgdjSc",
      publishedAt: "2026-04-02",
      duration: "3,12 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "0UqjmLIK_jQ",
      publishedAt: "2026-04-02",
      duration: "3,12 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "hWazO7VXjnw",
      publishedAt: "2026-04-02",
      duration: "3,12 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "DAQueL0n6sI",
      publishedAt: "2026-04-02",
      duration: "3,12 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Entrenamiento en piki team",
      description: "",
      youtubeId: "aj6RtWQOkqA",
      publishedAt: "2026-03-21",
      duration: "3,12 min",
      category: "",
      trainingType: "entrenamiento",
    },
  ],
};
