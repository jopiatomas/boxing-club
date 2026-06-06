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
      shift: "Tarde",
      hours: "16:30 - 18:00 / 18:00 - 19:30",
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
  trainingVideos: [],
};
