import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DeleteDialog, LoginDialog } from "../components/videos/ProfessorDialogs";
import { UploadDialog } from "../components/videos/UploadDialog";
import { VideoCard, VideoCardSkeleton } from "../components/videos/VideoCard";
import { Icon } from "../components/ui/Icon";
import { trainingTypeLabels, trainingTypeOrder } from "../data/siteContent";
import { useSession } from "../hooks/useSession";
import { useUploadQueue } from "../hooks/useUploadQueue";
import { useVideos } from "../hooks/useVideos";
import { removeVideo, type ApiVideo, type TrainingType } from "../lib/api";
import { weekLabel, weekStart } from "../lib/dates";
import { friendlyDeleteError, isSessionExpired } from "../lib/errors";

type Filter = "todos" | TrainingType;

const PAGE_SIZE = 12;

function readFilterFromUrl(): Filter {
  const value = new URLSearchParams(window.location.search).get("tipo");
  return value && (trainingTypeOrder as string[]).includes(value) ? (value as TrainingType) : "todos";
}

function groupByWeek(videos: ApiVideo[]) {
  const groups: { key: string; label: string; videos: ApiVideo[] }[] = [];
  for (const video of videos) {
    const key = weekStart(video.publishedAt);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.videos.push(video);
    else groups.push({ key, label: weekLabel(key), videos: [video] });
  }
  return groups;
}

export function VideosPage() {
  const { videos, status, error, isSlow, reload, setVideos } = useVideos();
  const session = useSession();
  const queue = useUploadQueue();

  const [filter, setFilter] = useState<Filter>(readFilterFromUrl);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [loginOpen, setLoginOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ApiVideo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isProfessor = session.isProfessor;

  // Mantener el filtro en la URL (/videos?tipo=guanteo) para poder compartirlo
  useEffect(() => {
    const url = new URL(window.location.href);
    if (filter === "todos") url.searchParams.delete("tipo");
    else url.searchParams.set("tipo", filter);
    window.history.replaceState(window.history.state, "", url);
  }, [filter]);

  // Si la sesión venció al validar el token guardado, ofrecer volver a entrar
  useEffect(() => {
    if (session.expired) setNotice("Tu sesión de profesor venció. Volvé a entrar para subir o borrar videos.");
  }, [session.expired]);

  const counts = useMemo(() => {
    const result: Record<TrainingType, number> = { entrenamiento: 0, guanteo: 0, exhibicion: 0 };
    for (const video of videos) result[video.trainingType] += 1;
    return result;
  }, [videos]);

  const filtered = useMemo(
    () => (filter === "todos" ? videos : videos.filter((video) => video.trainingType === filter)),
    [filter, videos],
  );
  const [featured, ...rest] = filtered;
  const groups = useMemo(() => groupByWeek(rest.slice(0, visibleCount)), [rest, visibleCount]);
  const remaining = rest.length - visibleCount;

  function changeFilter(next: Filter) {
    setFilter(next);
    setVisibleCount(PAGE_SIZE);
  }

  function handleSessionExpired() {
    session.logout({ expired: true });
    setUploadOpen(false);
    setLoginOpen(true);
  }

  async function handleUploadAll() {
    if (!session.token) return;
    setNotice(null);
    const { uploaded } = await queue.uploadAll({
      token: session.token,
      onUploaded: (video) => setVideos((current) => [video, ...current.filter((item) => item.id !== video.id)]),
      onSessionExpired: handleSessionExpired,
    });
    if (uploaded > 0) {
      void reload({ silent: true });
      setFilter("todos");
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete || !session.token) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await removeVideo(session.token, pendingDelete.id);
      setVideos((current) => current.filter((video) => video.id !== pendingDelete.id));
      setNotice(`Se borró “${pendingDelete.title}”.`);
      setPendingDelete(null);
    } catch (deleteFailure) {
      if (isSessionExpired(deleteFailure)) {
        setPendingDelete(null);
        handleSessionExpired();
      } else {
        setDeleteError(friendlyDeleteError(deleteFailure));
      }
    } finally {
      setDeleting(false);
    }
  }

  const deleteHandler = (video: ApiVideo) =>
    isProfessor
      ? () => {
          setDeleteError(null);
          setPendingDelete(video);
        }
      : undefined;

  return (
    <main id="contenido" className={`flex-1 pb-20 ${isProfessor ? "pb-36" : ""}`}>
      {/* Cabecera */}
      <section className="container-x pt-8 sm:pt-12" aria-labelledby="titulo-videos">
        <p className="label text-celeste">Biblioteca del club</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h1 id="titulo-videos" className="heading text-hero text-paper">
            Videos
          </h1>
          {status === "ready" && videos.length ? (
            <p className="label pb-2 text-muted">
              {videos.length} {videos.length === 1 ? "video" : "videos"}
            </p>
          ) : null}
        </div>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Entrenamientos, guanteos y exhibiciones del gimnasio. Repasá la técnica cuando quieras.
        </p>
      </section>

      {notice ? (
        <div className="container-x mt-6">
          <div role="status" className="flex items-start justify-between gap-3 rounded-[var(--radius-sm)] border-l-4 border-celeste bg-ink-800 p-4">
            <p>{notice}</p>
            <button type="button" className="btn btn-ghost btn-sm -my-1 -mr-2 px-2" onClick={() => setNotice(null)} aria-label="Cerrar aviso">
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>
      ) : null}

      {/* Filtros */}
      {status === "ready" && videos.length ? (
        <div className="sticky top-16 z-30 mt-6 border-y border-ink-700 bg-ink-900/95 backdrop-blur md:top-[4.5rem]">
          <div className="container-x">
            <div role="group" aria-label="Filtrar por tipo" className="-mx-1 flex gap-2 overflow-x-auto px-1 py-3 [scrollbar-width:none]">
              {(["todos", ...trainingTypeOrder] as Filter[])
                .filter((option) => option === "todos" || counts[option] > 0)
                .map((option) => {
                  const selected = filter === option;
                  const count = option === "todos" ? videos.length : counts[option];
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => changeFilter(option)}
                      className={`label flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-[0.9375rem] transition-colors ${
                        selected
                          ? "border-celeste bg-celeste text-ink-900"
                          : "border-ink-600 text-paper hover:border-celeste"
                      }`}
                    >
                      {option === "todos" ? "Todos" : trainingTypeLabels[option]}
                      <span className={selected ? "text-ink-800" : "text-subtle"}>{count}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      ) : null}

      <div className="container-x mt-6 sm:mt-8">
        {status === "loading" ? (
          <div aria-busy="true">
            <p role="status" className="sr-only">Cargando videos…</p>
            <VideoCardSkeleton featured />
            {isSlow ? (
              <p className="mt-4 flex items-center gap-2 text-muted" role="status">
                <span className="h-2 w-2 shrink-0 rounded-full bg-celeste motion-safe:animate-pulse" aria-hidden="true" />
                El servidor se está despertando. La primera carga puede tardar hasta un minuto.
              </p>
            ) : null}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <VideoCardSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : status === "error" ? (
          <StateBox
            icon="alert"
            title="No se pudieron cargar los videos"
            text={error ?? "Probá de nuevo en unos segundos."}
            action={
              <button type="button" className="btn btn-primary" onClick={() => void reload()}>
                <Icon name="refresh" size={18} />
                Reintentar
              </button>
            }
          />
        ) : !videos.length ? (
          <StateBox
            icon="video"
            title="Todavía no hay videos"
            text={isProfessor ? "Subí el primero y va a aparecer acá." : "Pronto el profe va a subir los primeros entrenamientos."}
            action={
              isProfessor ? (
                <button type="button" className="btn btn-primary" onClick={() => setUploadOpen(true)}>
                  <Icon name="upload" size={18} />
                  Subir videos
                </button>
              ) : null
            }
          />
        ) : !featured ? (
          <StateBox
            icon="video"
            title={`Todavía no hay videos de ${filter === "todos" ? "este tipo" : trainingTypeLabels[filter].toLowerCase()}`}
            text="Probá con otro tipo o mirá todos."
            action={
              <button type="button" className="btn btn-secondary" onClick={() => changeFilter("todos")}>
                Ver todos
              </button>
            }
          />
        ) : (
          <>
            <h2 className="sr-only">Video más reciente</h2>
            <VideoCard
              video={featured}
              featured
              active={activeId === featured.id}
              onPlay={() => setActiveId(featured.id)}
              onDelete={deleteHandler(featured)}
            />

            {groups.map((group) => (
              <section key={group.key} className="mt-12" aria-labelledby={`semana-${group.key}`}>
                <div className="mb-5 flex items-center gap-4">
                  <h2 id={`semana-${group.key}`} className="heading shrink-0 text-[1.75rem] text-paper first-letter:uppercase">
                    {group.label}
                  </h2>
                  <div className="ropes flex-1 opacity-60" aria-hidden="true">
                    <span />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      active={activeId === video.id}
                      onPlay={() => setActiveId(video.id)}
                      onDelete={deleteHandler(video)}
                    />
                  ))}
                </div>
              </section>
            ))}

            {remaining > 0 ? (
              <div className="mt-10 flex justify-center">
                <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  Ver más videos <span className="text-muted">({remaining})</span>
                </button>
              </div>
            ) : null}
          </>
        )}

        {/* Acceso profesor (discreto, al final) */}
        {!isProfessor && !session.isChecking ? (
          <div className="mt-16 flex justify-center border-t border-ink-800 pt-8">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLoginOpen(true)}>
              <Icon name="lock" size={16} />
              Acceso profesor
            </button>
          </div>
        ) : null}
      </div>

      {/* Barra del profesor */}
      {isProfessor ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-celeste bg-ink-950/95 backdrop-blur">
          <div className="container-x flex items-center gap-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="hidden min-w-0 flex-1 sm:block">
              <p className="label text-subtle">Profesor</p>
              <p className="truncate font-semibold">{session.user?.name}</p>
            </div>
            <button type="button" className="btn btn-primary flex-1 sm:flex-none" onClick={() => setUploadOpen(true)}>
              <Icon name="upload" size={18} />
              {queue.isUploading ? "Subiendo…" : "Subir videos"}
              {queue.items.length && !queue.isUploading ? <span className="rounded-full bg-ink-900 px-2 text-celeste">{queue.items.length}</span> : null}
            </button>
            <button
              type="button"
              className="btn btn-secondary px-3"
              onClick={() => {
                session.logout();
                queue.clear();
                setNotice("Cerraste la sesión.");
              }}
              disabled={queue.isUploading}
              aria-label="Cerrar sesión"
            >
              <Icon name="logout" size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      ) : null}

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={async (email, password) => {
          await session.login(email, password);
          setNotice(null);
          if (queue.items.some((item) => item.status !== "done")) setUploadOpen(true);
        }}
        notice={session.expired ? "Tu sesión venció. Entrá de nuevo para seguir." : null}
      />

      {isProfessor ? (
        <UploadDialog
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          items={queue.items}
          isUploading={queue.isUploading}
          onAddFiles={queue.addFiles}
          onUpdate={queue.updateField}
          onRemove={queue.remove}
          onUploadAll={() => void handleUploadAll()}
          onClear={queue.clear}
        />
      ) : null}

      <DeleteDialog
        video={pendingDelete}
        deleting={deleting}
        error={deleteError}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </main>
  );
}

type StateBoxProps = {
  icon: "alert" | "video";
  title: string;
  text: string;
  action?: ReactNode;
};

function StateBox({ icon, title, text, action }: StateBoxProps) {
  return (
    <div
      role={icon === "alert" ? "alert" : undefined}
      className="flex flex-col items-center gap-4 rounded-[var(--radius-sm)] border-2 border-dashed border-ink-600 px-6 py-14 text-center"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          icon === "alert" ? "bg-glove text-paper" : "bg-ink-800 text-celeste"
        }`}
      >
        <Icon name={icon} size={26} />
      </span>
      <h2 className="heading text-subtitle text-paper">{title}</h2>
      <p className="max-w-md text-muted">{text}</p>
      {action}
    </div>
  );
}
