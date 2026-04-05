import { ContactSection } from "../sections/ContactSection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { HeroSection } from "../sections/HeroSection";
import { ProgramsSection } from "../sections/ProgramsSection";
import { ScheduleSection } from "../sections/ScheduleSection";
import { StorySection } from "../sections/StorySection";

export function HomePage() {
  return (
    <main>
      <ContactSection />
      <ScheduleSection />
      <HeroSection />
      <StorySection />
      <ProgramsSection />
      <ExperienceSection />
    </main>
  );
}
