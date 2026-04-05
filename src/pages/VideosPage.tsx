import { useMemo, useState } from "react";
import { siteContent, type TrainingVideo } from "../data/siteContent";

type TrainingType = TrainingVideo["trainingType"];

type WeekGroup = {
  key: string;
  label: string;
  videosByType: Record<TrainingType, TrainingVideo[]>;
  total: number;
};

function parseContentDate(dateString: string) {
  return new Date(`${dateString}T12:00:00`);
}

function formatVideoDate(dateString: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseContentDate(dateString));
}

function getThumbnailUrl(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

function getWeekStart(dateString: string) {
  const date = parseContentDate(dateString);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  monday.setHours(12, 0, 0, 0);
  return monday;
}

function getWeekKey(dateString: string) {
  return getWeekStart(dateString).toISOString().slice(0, 10);
}

function getWeekLabel(weekKey: string) {
  const start = parseContentDate(weekKey);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const startDay = new Intl.DateTimeFormat("es-AR", { day: "numeric" }).format(
    start,
  );
  const endDay = new Intl.DateTimeFormat("es-AR", { day: "numeric" }).format(
    end,
  );
  const month = new Intl.DateTimeFormat("es-AR", { month: "long" }).format(
    start,
  );

  if (start.getMonth() === end.getMonth()) {
    return `Semana del ${startDay} al ${endDay} de ${month}`;
  }

  const endMonth = new Intl.DateTimeFormat("es-AR", { month: "long" }).format(
    end,
  );
  return `Semana del ${startDay} de ${month} al ${endDay} de ${endMonth}`;
}

function getTypeLabel(type: TrainingType) {
  return type === "entrenamiento" ? "Entrenamiento" : "Guanteo";
}

function buildWeekGroups(videos: TrainingVideo[]) {
  const weekMap = new Map<string, WeekGroup>();

  const sortedVideos = [...videos].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  sortedVideos.forEach((video) => {
    const weekKey = getWeekKey(video.publishedAt);
    const currentGroup = weekMap.get(weekKey);

    if (!currentGroup) {
      weekMap.set(weekKey, {
        key: weekKey,
        label: getWeekLabel(weekKey),
        videosByType: {
          entrenamiento: [],
          guanteo: [],
        },
        total: 0,
      });
    }

    const targetGroup = weekMap.get(weekKey);

    if (!targetGroup) {
      return;
    }

    targetGroup.videosByType[video.trainingType].push(video);
    targetGroup.total += 1;
  });

  return Array.from(weekMap.values()).sort((a, b) =>
    b.key.localeCompare(a.key),
  );
}

export function VideosPage() {
  const { trainingVideos, videosPage } = siteContent;
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedType, setSelectedType] = useState<"todos" | TrainingType>(
    "todos",
  );

  const allWeekGroups = useMemo(
    () => buildWeekGroups(trainingVideos),
    [trainingVideos],
  );
  const availableWeeks = allWeekGroups.map((weekGroup) => ({
    key: weekGroup.key,
    label: weekGroup.label,
  }));

  const visibleVideos = trainingVideos.filter((video) => {
    const matchesWeek = selectedWeek
      ? getWeekKey(video.publishedAt) === selectedWeek
      : true;
    const matchesType =
      selectedType === "todos" ? true : video.trainingType === selectedType;
    return matchesWeek && matchesType;
  });

  const visibleWeekGroups = useMemo(
    () => buildWeekGroups(visibleVideos),
    [visibleVideos],
  );

  return (
    <main className="px-6 pb-24 pt-12 lg:px-10 lg:pb-28 lg:pt-16">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                Filtrar entrenamientos
              </p>
              <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
                Semanas y tipos
              </h2>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                  Semana
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedWeek("")}
                    className={`rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                      selectedWeek === ""
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-ink)]"
                        : "border-white/15 text-white/75 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    }`}
                  >
                    Todas las semanas
                  </button>

                  {availableWeeks.map((week) => (
                    <button
                      key={week.key}
                      type="button"
                      onClick={() => setSelectedWeek(week.key)}
                      className={`rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                        selectedWeek === week.key
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-ink)]"
                          : "border-white/15 text-white/75 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                      }`}
                    >
                      {week.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                  Tipo
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {(["todos", "entrenamiento", "guanteo"] as const).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                          selectedType === type
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-ink)]"
                            : "border-white/15 text-white/75 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                        }`}
                      >
                        {type === "todos" ? "Todos" : getTypeLabel(type)}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm uppercase tracking-[0.22em] text-white/55">
          {visibleVideos.length} videos{" "}
          {selectedWeek || selectedType !== "todos"
            ? "filtrados"
            : "disponibles"}
        </p>

        <div className="mt-8 flex flex-col gap-8">
          {visibleWeekGroups.map((weekGroup) => (
            <section
              key={weekGroup.key}
              className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 md:p-8"
            >
              <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                    Semana
                  </p>
                  <h3 className="mt-2 font-display text-4xl uppercase tracking-[0.08em] text-white">
                    {weekGroup.label}
                  </h3>
                </div>

                <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                  {weekGroup.total} piezas en esta semana
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-10">
                {(["entrenamiento", "guanteo"] as const).map((type) => {
                  const videos = weekGroup.videosByType[type];

                  if (!videos.length) {
                    return null;
                  }

                  return (
                    <div key={type}>
                      <div className="mb-5 flex items-center gap-3">
                        <span className="h-px flex-1 bg-white/10" />
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                          {getTypeLabel(type)}
                        </p>
                        <span className="h-px flex-1 bg-white/10" />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {videos.map((video) => (
                          <article
                            key={`${video.youtubeId}-${video.publishedAt}`}
                            className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[rgba(7,18,38,0.55)]"
                          >
                            <a
                              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block"
                            >
                              <img
                                src={getThumbnailUrl(video.youtubeId)}
                                alt={video.title}
                                className="h-56 w-full object-cover"
                                loading="lazy"
                              />
                            </a>

                            <div className="p-6">
                              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-white/55">
                                <span>{video.category}</span>
                                <span>{video.duration}</span>
                                <span>
                                  {formatVideoDate(video.publishedAt)}
                                </span>
                              </div>

                              <h4 className="mt-4 font-display text-3xl uppercase tracking-[0.08em] text-white">
                                {video.title}
                              </h4>
                              <p className="mt-4 text-sm leading-7 text-white/70">
                                {video.description}
                              </p>

                              <a
                                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 inline-flex rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink)] transition hover:bg-transparent hover:text-[var(--color-accent)]"
                              >
                                Ver en YouTube
                              </a>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {!visibleWeekGroups.length ? (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
            <p className="font-display text-3xl uppercase tracking-[0.08em] text-white">
              No hay videos para esa combinación.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Probá cambiar la semana o volver a mostrar todos los tipos.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
