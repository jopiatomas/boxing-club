import { ContactSection } from "../sections/ContactSection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { ScheduleSection } from "../sections/ScheduleSection";
import { VisitSection } from "../sections/VisitSection";

type HomePageProps = {
  onNavigate: (href: string) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main>
      <ExperienceSection />
      <ContactSection />
      <ScheduleSection />
      <VisitSection onNavigate={onNavigate} />
    </main>
  );
}
