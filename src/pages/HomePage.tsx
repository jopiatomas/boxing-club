import { ContactSection } from "../sections/ContactSection";
import { HeroSection } from "../sections/HeroSection";
import { LatestVideosSection } from "../sections/LatestVideosSection";
import { ScheduleSection } from "../sections/ScheduleSection";
import { SpaceSection } from "../sections/SpaceSection";

type HomePageProps = {
  onNavigate: (href: string) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main id="contenido" className="flex-1">
      <HeroSection onNavigate={onNavigate} />
      <LatestVideosSection onNavigate={onNavigate} />
      <ScheduleSection />
      <SpaceSection />
      <ContactSection />
    </main>
  );
}
