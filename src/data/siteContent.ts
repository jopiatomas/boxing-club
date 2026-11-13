import type { TrainingType } from "../lib/api";

export type NavigationItem = {
  label: string;
  href: string;
};

export type ScheduleItem = {
  shift: string;
  hours: string;
  coach: string;
};

export const siteContent = {
  navigation: [
    { label: "Espacio", href: "/#espacio" },
    { label: "Horarios", href: "/#horarios" },
    { label: "Contacto", href: "/#contacto" },
  ] satisfies NavigationItem[],
  schedule: [
    { shift: "Mañana", hours: "8:30 - 10:00", coach: `Nacho` },
    { shift: "Mañana", hours: "10:00 - 11:30", coach: `"Piki" Delacroix` },
    { shift: "Tarde", hours: "15:00 - 16:30", coach: `"El Eze"` },
    { shift: "Tarde", hours: "16:30 - 18:00", coach: `Nestor` },
    {
      shift: "Noche",
      hours: "18:00 - 19:30 / 19:30 - 21:00",
      coach: `"Piki" Delacroix`,
    },
  ] satisfies ScheduleItem[],
  contact: {
    address: "Rodriguez Peña 3755",
    city: "Mar del Plata",
    mapsHref: "https://www.google.com/maps/search/?api=1&query=Gimnasio+Pikiteam+Rodriguez+Pe%C3%B1a+3755+Mar+del+Plata",
    phone: "223 504-4369",
    phoneHref: "https://wa.me/5492235044369",
    instagram: "@piki_team",
    instagramHref: "https://www.instagram.com/piki_team/",
    hours: "Lunes a viernes 15:00/16:30/18:00/19:30",
  },
  motto: "Borrá de tu mente el “no puedo”",
};

export const trainingTypeLabels: Record<TrainingType, string> = {
  entrenamiento: "Entrenamiento",
  guanteo: "Guanteo",
  exhibicion: "Exhibición",
};

export const trainingTypeOrder: TrainingType[] = ["entrenamiento", "guanteo", "exhibicion"];
