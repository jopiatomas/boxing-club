export type NavigationItem = {
  label: string;
  href: string;
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
  schedule: ScheduleItem[];
  experience: ExperienceItem[];
  contact: {
    address: string;
    phone: string;
    phoneHref: string;
    instagram: string;
    instagramHref: string;
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
    { label: "Espacio", href: "/#espacio" },
    { label: "Contacto", href: "/#contacto" },
    { label: "Horarios", href: "/#horarios" },
    { label: "Videos", href: "/videos" },
  ],
  schedule: [
    {
      shift: "Tarde",
      hours: "15:00 - 16:30",
      coach: "Técnica general y bolsa",
    },
    {
      shift: "Tarde/Noche",
      hours: "16:30 - 18:00",
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
    address: "Rodriguez Peña 3755",
    phone: "223 504-4369",
    phoneHref: "https://wa.me/5492235044369",
    instagram: "@piki_team",
    instagramHref: "https://www.instagram.com/piki_team/",
    hours: "Lunes a viernes 15:00/16:30/18:00/19:30",
  },
  footer: {
    copy: "Todos los derechos reservados.",
    links: [
      { label: "Horarios", href: "/#horarios" },
      { label: "Espacio", href: "/#espacio" },
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
