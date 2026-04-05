import { ContactSection } from "../sections/ContactSection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { ScheduleSection } from "../sections/ScheduleSection";
import { VisitSection } from "../sections/VisitSection";

export function HomePage() {
  return (
    <main>
      <ExperienceSection />
      <ContactSection />
      <ScheduleSection />
      <VisitSection />
    </main>
  );
}
