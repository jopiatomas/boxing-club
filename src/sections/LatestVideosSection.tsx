import { useState } from "react";
import { AppLink } from "../components/AppLink";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Icon } from "../components/ui/Icon";
import { VideoCard, VideoCardSkeleton } from "../components/videos/VideoCard";
import { useVideos } from "../hooks/useVideos";

type LatestVideosSectionProps = {
  onNavigate: (href: string) => void;
};

/** Los últimos videos del club, con el mismo lite embed que la biblioteca. */
export function LatestVideosSection({ onNavigate }: LatestVideosSectionProps) {
  const { videos, status } = useVideos();
  const [activeId, setActiveId] = useState<string | null>(null);
  const latest = videos.slice(0, 3);

  // Si la API falla o no hay videos, la sección queda como acceso directo a /videos
  const showCards = status === "loading" || latest.length > 0;

  return (
    <section id="visita" aria-labelledby="titulo-ultimos" className="py-16 md:py-24">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="titulo-ultimos" eyebrow="Seguí entrenando" title="Lo último del gimnasio">
            Entrenamientos y guanteos que sube el profe para repasar la técnica fuera de clase.
          </SectionHeading>
          <AppLink href="/videos" onNavigate={onNavigate} className="btn btn-secondary shrink-0 self-start md:self-auto">
            Ver todos los videos
            <Icon name="arrowRight" size={18} />
          </AppLink>
        </div>

        {showCards ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy={status === "loading"}>
            {status === "loading"
              ? Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className={index > 0 ? "hidden sm:block" : ""}>
                    <VideoCardSkeleton />
                  </div>
                ))
              : latest.map((video, index) => (
                  <div key={video.id} className={index === 2 ? "hidden lg:block" : ""}>
                    <VideoCard video={video} active={activeId === video.id} onPlay={() => setActiveId(video.id)} />
                  </div>
                ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
