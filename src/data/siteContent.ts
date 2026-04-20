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
  trainingType: "entrenamiento" | "guanteo" | "exhibicion";
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
    { label: "Entrenamientos", href: "/#visita" },
    { label: "Videos", href: "/videos" },
  ],
  schedule: [
    {
      shift: "Tarde",
      hours: "15:00 - 16:30",
      coach: `"Piki" Delacroix`,
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
  experience: [],
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
      "La mejor estructura es usar YouTube como hosting y descubrimiento, pero guardar en tu app los metadatos de cada video. Así podés ordenarlos por semana, separar entrenamientos, guanteos y exhibiciones, y destacar contenido nuevo sin depender de la interfaz de YouTube.",
    helper:
      "Agrupar por semana y tipo te da una lectura mucho más cercana a la rutina real del club. El usuario entiende rápido qué corresponde a trabajo técnico, qué corresponde a guanteo y qué corresponde a exhibición.",
  },
  trainingVideos: [
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "UuYBvZQSbq4",
      publishedAt: "2026-04-02",
      duration: "2:58 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "I4qLIx5h8-w",
      publishedAt: "2026-04-02",
      duration: "3:11 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "mQFylEx79g4",
      publishedAt: "2026-04-02",
      duration: "3:00 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "pxseXVgdjSc",
      publishedAt: "2026-04-02",
      duration: "3:05 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "0UqjmLIK_jQ",
      publishedAt: "2026-04-02",
      duration: "3:00 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "hWazO7VXjnw",
      publishedAt: "2026-04-02",
      duration: "3:00 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Club Mitre",
      description: "",
      youtubeId: "DAQueL0n6sI",
      publishedAt: "2026-04-02",
      duration: "2:56 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Entrenamiento en piki team",
      description: "",
      youtubeId: "aj6RtWQOkqA",
      publishedAt: "2026-03-21",
      duration: "1:30 min",
      category: "",
      trainingType: "entrenamiento",
    },
    {
      title: "Entrenamiento en piki team",
      description: "",
      youtubeId: "_QOKLf5mLi8",
      publishedAt: "2026-04-06",
      duration: "1:30 min",
      category: "",
      trainingType: "entrenamiento",
    },
    {
      title: "Guanteo en Piki Team",
      description: "",
      youtubeId: "vyj05tkjydM",
      publishedAt: "2026-03-26",
      duration: "1:25 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Piki Team",
      description: "",
      youtubeId: "KPzHE8B1QxQ",
      publishedAt: "2026-03-26",
      duration: "1:15 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Piki Team",
      description: "",
      youtubeId: "B7jVAVbLNr4",
      publishedAt: "2026-04-09",
      duration: "1:31 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Piki Team",
      description: "",
      youtubeId: "cqpgNTxZbXI",
      publishedAt: "2026-04-09",
      duration: "2:49 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Piki Team",
      description: "",
      youtubeId: "DJ5yGFrcHHM",
      publishedAt: "2026-04-09",
      duration: "1:32 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Piki Team",
      description: "",
      youtubeId: "8t1DIrWs5Yo",
      publishedAt: "2026-04-09",
      duration: "1:03 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Piki Team",
      description: "",
      youtubeId: "kn-XZXVy_uU",
      publishedAt: "2026-04-09",
      duration: "2:13 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Guanteo en Piki Team",
      description: "",
      youtubeId: "WnKss7H8ihE",
      publishedAt: "2026-04-09",
      duration: "2:05 min",
      category: "",
      trainingType: "guanteo",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "P61dYmCg89o",
      publishedAt: "2026-04-18",
      duration: "1:27 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "ZihdLHjhhto",
      publishedAt: "2026-04-18",
      duration: "1:37 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "zkBuGh3in1g",
      publishedAt: "2026-04-18",
      duration: "1:28 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "wOrSAZZ0MN0",
      publishedAt: "2026-04-18",
      duration: "1:33 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "u1QfdplotGA",
      publishedAt: "2026-04-18",
      duration: "2:07 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "iNRevSNE5pY",
      publishedAt: "2026-04-18",
      duration: "2:02 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "Kn4OFxiTUu8",
      publishedAt: "2026-04-18",
      duration: "2:07 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "7mERU5J8ZCY",
      publishedAt: "2026-04-18",
      duration: "1:32 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "-xI406KvPf8",
      publishedAt: "2026-04-18",
      duration: "1:25 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "s-9aHU268ko",
      publishedAt: "2026-04-18",
      duration: "1:27 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "p4IARWS8eq8",
      publishedAt: "2026-04-18",
      duration: "0:24 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "L1D6KYDTOZY",
      publishedAt: "2026-04-18",
      duration: "2:07 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "9CRW9SXz-ns",
      publishedAt: "2026-04-18",
      duration: "2:09 min",
      category: "",
      trainingType: "exhibicion",
    },
    {
      title: "Exhibicion en San José",
      description: "",
      youtubeId: "i3pOOQXoNFg",
      publishedAt: "2026-04-18",
      duration: "1:55 min",
      category: "",
      trainingType: "exhibicion",
    },
  ],
};
