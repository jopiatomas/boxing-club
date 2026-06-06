import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { siteContent } from "../data/siteContent";
import {
  getCurrentUser,
  listVideos,
  loginUser,
  removeVideo,
  resolveMediaUrl,
  uploadVideo,
  type ApiVideo,
  type ApiUser,
  type TrainingType,
} from "../lib/api";

type NoticeTone = "success" | "error" | "info";

type Notice = {
  tone: NoticeTone;
  message: string;
};

type UploadStatus = "idle" | "uploading" | "error" | "success";

type UploadDraft = {
  id: string;
  file: File;
  title: string;
  description: string;
  category: string;
  trainingType: TrainingType;
  publishedAt: string;
  durationLabel: string;
  status: UploadStatus;
  errorMessage: string | null;
};

type WeekGroup = {
  key: string;
  label: string;
  videosByType: Record<TrainingType, ApiVideo[]>;
  total: number;
};

const authTokenStorageKey = "piki-team-access-token";
const acceptedVideoFiles = ".mp4,.mov,.webm,.mkv,video/*";

const inputClassName =
  "w-full rounded-[1rem] border border-white/12 bg-[rgba(5,12,26,0.65)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[var(--color-accent)] focus:bg-[rgba(8,18,37,0.92)]";
const textareaClassName = `${inputClassName} min-h-28 resize-y`;
const secondaryButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-white/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/78 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/35";
const primaryButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink)] transition hover:bg-transparent hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35";

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
  if (type === "entrenamiento") {
    return "Entrenamiento";
  }

  if (type === "guanteo") {
    return "Guanteo";
  }

  return "Exhibicion";
}

function getRoleLabel(role: ApiUser["role"]) {
  return role === "professor" ? "Profesor" : "Usuario";
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getTodayDateValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function sanitizeFileName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isAcceptedVideoFile(file: File) {
  return (
    file.type.startsWith("video/") || /\.(mp4|mov|webm|mkv)$/i.test(file.name)
  );
}

function isYoutubeVideo(video: ApiVideo) {
  return video.provider === "youtube" && Boolean(video.embedUrl);
}

function buildWeekGroups(videos: ApiVideo[]) {
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
          exhibicion: [],
        },
        total: 0,
      });
    }

    const group = weekMap.get(weekKey);

    if (!group) {
      return;
    }

    group.videosByType[video.trainingType].push(video);
    group.total += 1;
  });

  return Array.from(weekMap.values()).sort((a, b) =>
    b.key.localeCompare(a.key),
  );
}

function getNoticeStyles(tone: NoticeTone) {
  if (tone === "success") {
    return "border-emerald-400/25 bg-emerald-500/12 text-emerald-100";
  }

  if (tone === "error") {
    return "border-rose-400/25 bg-rose-500/12 text-rose-100";
  }

  return "border-sky-400/25 bg-sky-500/12 text-sky-100";
}

function getUploadStatusStyles(status: UploadStatus) {
  if (status === "uploading") {
    return "border-sky-400/20 bg-sky-500/12 text-sky-100";
  }

  if (status === "success") {
    return "border-emerald-400/20 bg-emerald-500/12 text-emerald-100";
  }

  if (status === "error") {
    return "border-rose-400/20 bg-rose-500/12 text-rose-100";
  }

  return "border-white/12 bg-white/5 text-white/70";
}

function getUploadStatusLabel(status: UploadStatus) {
  if (status === "uploading") {
    return "Subiendo";
  }

  if (status === "success") {
    return "Cargado";
  }

  if (status === "error") {
    return "Con error";
  }

  return "Listo";
}

function createUploadDraft(file: File): UploadDraft {
  return {
    id: crypto.randomUUID(),
    file,
    title: sanitizeFileName(file.name) || "Video nuevo",
    description: "",
    category: "",
    trainingType: "entrenamiento",
    publishedAt: getTodayDateValue(),
    durationLabel: "",
    status: "idle",
    errorMessage: null,
  };
}

export function VideosPage() {
  const [token, setToken] = useState(
    () => window.localStorage.getItem(authTokenStorageKey) || "",
  );
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [videos, setVideos] = useState<ApiVideo[]>([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedType, setSelectedType] = useState<"todos" | TrainingType>(
    "todos",
  );
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
  });
  const [notice, setNotice] = useState<Notice | null>(null);
  const [uploadQueue, setUploadQueue] = useState<UploadDraft[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [isBootstrappingSession, setIsBootstrappingSession] = useState(
    Boolean(token),
  );
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [isRefreshingVideos, setIsRefreshingVideos] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [videoPendingDelete, setVideoPendingDelete] = useState<ApiVideo | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allWeekGroups = useMemo(() => buildWeekGroups(videos), [videos]);
  const availableWeeks = allWeekGroups.map((weekGroup) => ({
    key: weekGroup.key,
    label: weekGroup.label,
  }));

  const visibleVideos = useMemo(
    () =>
      videos.filter((video) => {
        const matchesWeek = selectedWeek
          ? getWeekKey(video.publishedAt) === selectedWeek
          : true;
        const matchesType =
          selectedType === "todos" ? true : video.trainingType === selectedType;
        return matchesWeek && matchesType;
      }),
    [selectedType, selectedWeek, videos],
  );

  const visibleWeekGroups = useMemo(
    () => buildWeekGroups(visibleVideos),
    [visibleVideos],
  );
  const isProfessor = currentUser?.role === "professor";
  const isAuthenticated = Boolean(currentUser);
  const sessionLoading = Boolean(token) && isBootstrappingSession;

  useEffect(() => {
    if (
      selectedWeek &&
      !availableWeeks.some((week) => week.key === selectedWeek)
    ) {
      setSelectedWeek("");
    }
  }, [availableWeeks, selectedWeek]);

  useEffect(() => {
    let ignore = false;

    async function loadPublicVideos() {
      setIsLoadingVideos(true);

      try {
        const response = await listVideos();

        if (ignore) {
          return;
        }

        setVideos(response.videos);
      } catch (error) {
        if (ignore) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "No se pudo cargar la biblioteca";
        setNotice({ tone: "error", message });
      } finally {
        if (!ignore) {
          setIsLoadingVideos(false);
        }
      }
    }

    void loadPublicVideos();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (token) {
      window.localStorage.setItem(authTokenStorageKey, token);
      return;
    }

    window.localStorage.removeItem(authTokenStorageKey);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      setIsBootstrappingSession(false);
      return;
    }

    let ignore = false;

    async function bootstrapPrivateArea() {
      setIsBootstrappingSession(true);

      try {
        const meResponse = await getCurrentUser(token);

        if (ignore) {
          return;
        }

        setCurrentUser(meResponse.user);
      } catch (error) {
        if (ignore) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "No se pudo cargar la sesion del profesor";
        setToken("");
        setCurrentUser(null);
        setNotice({
          tone: "error",
          message: message.includes("Token")
            ? "La sesion vencio. Volve a iniciar sesion."
            : message,
        });
      } finally {
        if (!ignore) {
          setIsBootstrappingSession(false);
        }
      }
    }

    void bootstrapPrivateArea();

    return () => {
      ignore = true;
    };
  }, [token]);

  async function refreshVideos() {
    setIsRefreshingVideos(true);

    try {
      const response = await listVideos();
      setVideos(response.videos);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la biblioteca";
      setNotice({ tone: "error", message });
    } finally {
      setIsRefreshingVideos(false);
    }
  }

  function clearSession(message?: string) {
    setToken("");
    setCurrentUser(null);
    setUploadQueue([]);

    if (message) {
      setNotice({ tone: "info", message });
    }
  }

  function handleAuthFieldChange(field: "email" | "password", value: string) {
    setAuthForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingAuth(true);
    setNotice(null);

    try {
      const response = await loginUser({
        email: authForm.email.trim(),
        password: authForm.password,
      });

      setToken(response.token);
      setCurrentUser(response.user);
      setAuthForm({
        email: authForm.email.trim(),
        password: "",
      });
      setNotice({
        tone: "success",
        message: `Sesion iniciada como ${response.user.name}.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo completar la autenticacion";
      setNotice({ tone: "error", message });
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  function handleFilesAdded(files: File[]) {
    if (!files.length) {
      return;
    }

    const acceptedFiles = files.filter(isAcceptedVideoFile);
    const rejectedCount = files.length - acceptedFiles.length;

    if (!acceptedFiles.length) {
      setNotice({
        tone: "error",
        message: "Solo se pueden preparar archivos MP4, MOV, WEBM o MKV.",
      });
      return;
    }

    setUploadQueue((current) => [
      ...current,
      ...acceptedFiles.map(createUploadDraft),
    ]);

    if (rejectedCount > 0) {
      setNotice({
        tone: "info",
        message: `${acceptedFiles.length} archivo(s) listos. ${rejectedCount} se ignoraron por formato no valido.`,
      });
      return;
    }

    setNotice({
      tone: "success",
      message: `${acceptedFiles.length} archivo(s) agregados a la cabina del profesor.`,
    });
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFilesAdded(Array.from(event.target.files || []));
    event.currentTarget.value = "";
  }

  function updateDraft(
    id: string,
    updater: (draft: UploadDraft) => UploadDraft,
  ) {
    setUploadQueue((current) =>
      current.map((draft) => (draft.id === id ? updater(draft) : draft)),
    );
  }

  function handleDraftTextChange(
    id: string,
    field:
      | "title"
      | "description"
      | "category"
      | "publishedAt"
      | "durationLabel",
    value: string,
  ) {
    updateDraft(id, (draft) => ({
      ...draft,
      [field]: value,
      status: draft.status === "error" ? "idle" : draft.status,
      errorMessage: null,
    }));
  }

  function handleDraftTypeChange(id: string, value: TrainingType) {
    updateDraft(id, (draft) => ({
      ...draft,
      trainingType: value,
      status: draft.status === "error" ? "idle" : draft.status,
      errorMessage: null,
    }));
  }

  function handleRemoveDraft(id: string) {
    setUploadQueue((current) => current.filter((draft) => draft.id !== id));
  }

  async function handleUploadQueue() {
    if (!token || !isProfessor || !uploadQueue.length) {
      return;
    }

    setIsUploading(true);
    setNotice(null);

    let successCount = 0;
    let failedCount = 0;

    for (const draft of uploadQueue) {
      updateDraft(draft.id, (current) => ({
        ...current,
        status: "uploading",
        errorMessage: null,
      }));

      try {
        await uploadVideo(token, {
          file: draft.file,
          title: draft.title.trim(),
          description: draft.description.trim(),
          category: draft.category.trim(),
          trainingType: draft.trainingType,
          publishedAt: draft.publishedAt,
          durationLabel: draft.durationLabel.trim(),
        });

        successCount += 1;

        updateDraft(draft.id, (current) => ({
          ...current,
          status: "success",
          errorMessage: null,
        }));
      } catch (error) {
        failedCount += 1;
        const message =
          error instanceof Error ? error.message : "No se pudo subir el video";

        updateDraft(draft.id, (current) => ({
          ...current,
          status: "error",
          errorMessage: message,
        }));
      }
    }

    if (successCount > 0) {
      await refreshVideos();
    }

    setUploadQueue((current) =>
      current.filter((draft) => draft.status === "error"),
    );

    if (successCount > 0 && failedCount === 0) {
      setNotice({
        tone: "success",
        message: `${successCount} video(s) subidos a YouTube correctamente. El procesamiento puede tardar unos minutos.`,
      });
    } else if (successCount > 0) {
      setNotice({
        tone: "info",
        message: `${successCount} video(s) enviados a YouTube y ${failedCount} con error. Revisa la cola antes de reintentar.`,
      });
    } else {
      setNotice({
        tone: "error",
        message: "No se pudo completar la carga de los videos.",
      });
    }

    setIsUploading(false);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setIsDragActive(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);
    handleFilesAdded(Array.from(event.dataTransfer.files || []));
  }

  function handleDeleteRequest(video: ApiVideo) {
    if (!token || !isProfessor) {
      return;
    }

    setVideoPendingDelete(video);
  }

  function handleCloseDeleteModal() {
    if (deletingVideoId) {
      return;
    }

    setVideoPendingDelete(null);
  }

  async function handleDeleteVideo() {
    if (!token || !isProfessor || !videoPendingDelete) {
      return;
    }

    const video = videoPendingDelete;

    setDeletingVideoId(video.id);

    try {
      await removeVideo(token, video.id);
      setVideos((current) => current.filter((item) => item.id !== video.id));
      setVideoPendingDelete(null);
      setNotice({
        tone: "info",
        message: `Se elimino "${video.title}" de la biblioteca.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo borrar el video";
      setNotice({ tone: "error", message });
    } finally {
      setDeletingVideoId(null);
    }
  }

  const videosPage = siteContent.videosPage;

  return (
    <main className="px-6 pb-24 pt-12 lg:px-10 lg:pb-28 lg:pt-16">
      <section className="mx-auto max-w-7xl">
        {videoPendingDelete ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,16,0.72)] px-6 backdrop-blur-sm"
            onClick={handleCloseDeleteModal}
          >
            <div
              className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(143,194,255,0.14),rgba(5,12,24,0.96)_58%)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.42)] md:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(143,194,255,0.2),transparent_72%)]" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                  Confirmar borrado
                </p>
                <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
                  Sacar este video de la biblioteca.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/68">
                  Vas a quitar{" "}
                  <span className="text-white">{videoPendingDelete.title}</span>{" "}
                  de la biblioteca publica. Los videos viejos pueden seguir
                  existiendo en YouTube aunque desaparezcan de esta pagina.
                </p>

                <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-black/18 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">
                    Video seleccionado
                  </p>
                  <p className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-white">
                    {videoPendingDelete.title}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/52">
                    {videoPendingDelete.category || "Sin categoria"} ·{" "}
                    {formatVideoDate(videoPendingDelete.publishedAt)}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseDeleteModal}
                    disabled={Boolean(deletingVideoId)}
                    className={secondaryButtonClassName}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteVideo()}
                    disabled={deletingVideoId === videoPendingDelete.id}
                    className={primaryButtonClassName}
                  >
                    {deletingVideoId === videoPendingDelete.id
                      ? "Borrando..."
                      : "Borrar video"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(143,194,255,0.16),rgba(9,20,37,0.96)_55%)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)] md:p-8 xl:p-10">
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(143,194,255,0.22),transparent_70%)]" />
          <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent)]">
                {videosPage.eyebrow}
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase tracking-[0.08em] text-white md:text-6xl xl:text-7xl">
                Biblioteca abierta.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
                Cualquier persona puede entrar y ver los videos del club. Si
                inicias sesion como profesor, esta pantalla permite revisar la
                biblioteca y borrar material publicado.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                Desde esta pantalla el profesor puede seleccionar o arrastrar
                archivos, revisarlos antes de enviarlos y publicarlos en
                YouTube.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.4rem] border border-white/10 bg-black/18 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/48">
                    Acceso
                  </p>
                  <p className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
                    Publico
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    La biblioteca se puede recorrer sin iniciar sesion.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/18 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/48">
                    Profesor
                  </p>
                  <p className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
                    Borra
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    Solo el profesor puede iniciar sesion para retirar material
                    de la biblioteca.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/18 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/48">
                    Reproduccion
                  </p>
                  <p className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
                    YouTube
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    El material visible se reproduce embebido desde YouTube.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-white/10 bg-[rgba(4,9,20,0.72)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:p-6">
              {isAuthenticated ? (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                        Profesor conectado
                      </p>
                      <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">
                        {currentUser?.name}
                      </h2>
                      <p className="mt-2 text-sm text-white/60">
                        {currentUser?.email}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-ink)]">
                      {currentUser ? getRoleLabel(currentUser.role) : ""}
                    </span>
                  </div>

                  <div className="mt-6 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.26em] text-white/42">
                      Permisos
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/70">
                      Tu cuenta puede subir y borrar videos. La cabina de carga
                      aparece debajo.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void refreshVideos()}
                      disabled={isRefreshingVideos || sessionLoading}
                      className={secondaryButtonClassName}
                    >
                      {isRefreshingVideos
                        ? "Actualizando..."
                        : "Actualizar biblioteca"}
                    </button>
                    <button
                      type="button"
                      onClick={() => clearSession("Sesion cerrada.")}
                      className={primaryButtonClassName}
                    >
                      Cerrar sesion
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                      Panel del profesor
                    </p>
                    <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">
                      Iniciar sesion
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">
                      La biblioteca es publica. El login queda reservado al
                      profesor para borrar material.
                    </p>
                  </div>

                  <form
                    className="mt-6 flex flex-col gap-4"
                    onSubmit={handleAuthSubmit}
                  >
                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
                      Email
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={(event) =>
                          handleAuthFieldChange("email", event.target.value)
                        }
                        className={inputClassName}
                        placeholder=""
                        required
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
                      Clave
                      <input
                        type="password"
                        value={authForm.password}
                        onChange={(event) =>
                          handleAuthFieldChange("password", event.target.value)
                        }
                        className={inputClassName}
                        placeholder=""
                        minLength={6}
                        maxLength={72}
                        required
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmittingAuth}
                      className={primaryButtonClassName}
                    >
                      {isSubmittingAuth ? "Procesando..." : "Ingresar ahora"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {notice ? (
          <div
            className={`mt-6 rounded-[1.35rem] border px-5 py-4 text-sm leading-7 ${getNoticeStyles(notice.tone)}`}
          >
            {notice.message}
          </div>
        ) : null}

        {isProfessor ? (
          <section className="mt-8 rounded-[1.9rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(4,10,20,0.9)_60%)] p-6 md:p-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                  Cabina del profesor
                </p>
                <h2 className="mt-3 font-display text-5xl uppercase tracking-[0.08em] text-white">
                  Arrastra videos y publicalos.
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
                  Puedes arrastrar uno o varios archivos. Cada uno entra a una
                  cola editable antes de subirse a YouTube y guardarse con su
                  metadata en la biblioteca.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={secondaryButtonClassName}
                >
                  Seleccionar archivos
                </button>
                <button
                  type="button"
                  onClick={() => void handleUploadQueue()}
                  disabled={!uploadQueue.length || isUploading}
                  className={primaryButtonClassName}
                >
                  {isUploading ? "Subiendo..." : "Subir cola completa"}
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedVideoFiles}
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-6 rounded-[1.7rem] border border-dashed p-7 transition md:p-8 ${
                isDragActive
                  ? "border-[var(--color-accent)] bg-[rgba(143,194,255,0.12)]"
                  : "border-white/14 bg-[rgba(2,6,16,0.6)]"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                Zona de carga
              </p>
              <h3 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">
                {isDragActive
                  ? "Solta los archivos aca."
                  : "Tira tus videos sobre esta cabina."}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">
                Acepta MP4, MOV, WEBM y MKV. Cada item de la cola puede
                corregirse antes de subirlo, incluyendo tipo, fecha, categoria y
                descripcion.
              </p>
            </div>

            {uploadQueue.length ? (
              <div className="mt-6 grid gap-4">
                {uploadQueue.map((draft) => (
                  <article
                    key={draft.id}
                    className="rounded-[1.55rem] border border-white/10 bg-[rgba(4,9,20,0.72)] p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/44">
                          Archivo listo
                        </p>
                        <h3 className="mt-2 font-display text-3xl uppercase tracking-[0.08em] text-white">
                          {draft.file.name}
                        </h3>
                        <p className="mt-2 text-sm text-white/58">
                          {formatBytes(draft.file.size)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full border px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${getUploadStatusStyles(draft.status)}`}
                        >
                          {getUploadStatusLabel(draft.status)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDraft(draft.id)}
                          disabled={draft.status === "uploading"}
                          className={secondaryButtonClassName}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-2">
                      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
                        Titulo
                        <input
                          type="text"
                          value={draft.title}
                          onChange={(event) =>
                            handleDraftTextChange(
                              draft.id,
                              "title",
                              event.target.value,
                            )
                          }
                          className={inputClassName}
                          maxLength={180}
                          required
                        />
                      </label>

                      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
                        Categoria
                        <input
                          type="text"
                          value={draft.category}
                          onChange={(event) =>
                            handleDraftTextChange(
                              draft.id,
                              "category",
                              event.target.value,
                            )
                          }
                          className={inputClassName}
                          placeholder="Tecnica, sparring, bolsa..."
                          maxLength={120}
                        />
                      </label>

                      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
                        Tipo
                        <select
                          value={draft.trainingType}
                          onChange={(event) =>
                            handleDraftTypeChange(
                              draft.id,
                              event.target.value as TrainingType,
                            )
                          }
                          className={inputClassName}
                        >
                          <option value="entrenamiento">Entrenamiento</option>
                          <option value="guanteo">Guanteo</option>
                          <option value="exhibicion">Exhibicion</option>
                        </select>
                      </label>

                      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
                        Fecha publicada
                        <input
                          type="date"
                          value={draft.publishedAt}
                          onChange={(event) =>
                            handleDraftTextChange(
                              draft.id,
                              "publishedAt",
                              event.target.value,
                            )
                          }
                          className={inputClassName}
                          required
                        />
                      </label>

                      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-white/55 xl:col-span-2">
                        Duracion visible
                        <input
                          type="text"
                          value={draft.durationLabel}
                          onChange={(event) =>
                            handleDraftTextChange(
                              draft.id,
                              "durationLabel",
                              event.target.value,
                            )
                          }
                          className={inputClassName}
                          placeholder="Ej: 2:45 min"
                          maxLength={30}
                        />
                      </label>

                      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-white/55 xl:col-span-2">
                        Descripcion
                        <textarea
                          value={draft.description}
                          onChange={(event) =>
                            handleDraftTextChange(
                              draft.id,
                              "description",
                              event.target.value,
                            )
                          }
                          className={textareaClassName}
                          placeholder="Que trabajo se hizo, foco tecnico, rounds, contexto..."
                          maxLength={5000}
                        />
                      </label>
                    </div>

                    {draft.errorMessage ? (
                      <p className="mt-4 rounded-[1rem] border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm leading-7 text-rose-100">
                        {draft.errorMessage}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-black/20 p-6 text-sm leading-7 text-white/60">
                La cola esta vacia. Arrastra archivos o usa el boton de
                seleccion para preparar la proxima tanda.
              </div>
            )}
          </section>
        ) : (
          <section className="mt-8 rounded-[1.75rem] border border-dashed border-white/14 bg-black/18 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Acceso publico
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Entra sin login y mira la biblioteca.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/64">
              Los videos publicados se cargan para cualquier visitante. Si eres
              el profesor, inicia sesion arriba para borrar material.
            </p>
          </section>
        )}

        {sessionLoading ? (
          <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/5 p-8 text-sm uppercase tracking-[0.24em] text-white/55">
            Validando sesion del profesor...
          </div>
        ) : null}

        {isLoadingVideos ? (
          <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/5 p-8 text-sm uppercase tracking-[0.24em] text-white/55">
            Cargando biblioteca publica...
          </div>
        ) : (
          <>
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                      Biblioteca publica
                    </p>
                    <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
                      Semanas, tipos y reproduccion directa
                    </h2>
                  </div>

                  <p className="text-sm uppercase tracking-[0.22em] text-white/55">
                    {visibleVideos.length} video(s){" "}
                    {selectedWeek || selectedType !== "todos"
                      ? "filtrados"
                      : "disponibles"}
                  </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
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
                      {(
                        [
                          "todos",
                          "entrenamiento",
                          "guanteo",
                          "exhibicion",
                        ] as const
                      ).map((type) => (
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
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {visibleWeekGroups.length ? (
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
                        {weekGroup.total} pieza(s) en esta semana
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-10">
                      {(
                        ["entrenamiento", "guanteo", "exhibicion"] as const
                      ).map((type) => {
                        const videosByType = weekGroup.videosByType[type];

                        if (!videosByType.length) {
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
                              {videosByType.map((video) => (
                                <article
                                  key={video.id}
                                  className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[rgba(7,18,38,0.55)]"
                                >
                                  {isYoutubeVideo(video) ? (
                                    <iframe
                                      src={resolveMediaUrl(
                                        video.embedUrl || "",
                                      )}
                                      title={video.title}
                                      loading="lazy"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      referrerPolicy="strict-origin-when-cross-origin"
                                      allowFullScreen
                                      className="h-60 w-full bg-[rgba(1,3,8,0.8)]"
                                    />
                                  ) : (
                                    <div className="flex h-60 w-full items-center justify-center bg-[rgba(1,3,8,0.8)] px-6 text-center text-xs uppercase tracking-[0.22em] text-white/45">
                                      Video no disponible
                                    </div>
                                  )}

                                  <div className="p-6">
                                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-white/55">
                                      <span>
                                        {video.category || "Sin categoria"}
                                      </span>
                                      <span>
                                        {formatVideoDate(video.publishedAt)}
                                      </span>
                                    </div>

                                    <h4 className="mt-4 font-display text-3xl uppercase tracking-[0.08em] text-white">
                                      {video.title}
                                    </h4>
                                    <p className="mt-4 text-sm leading-7 text-white/70">
                                      {video.description ||
                                        "Video publicado en la biblioteca del club."}
                                    </p>

                                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                                      <div className="text-xs uppercase tracking-[0.22em] text-white/48">
                                        <p>
                                          Subido por {video.uploadedBy.name}
                                        </p>
                                      </div>

                                      <div className="flex flex-wrap gap-3">
                                        <a
                                          href={resolveMediaUrl(video.watchUrl)}
                                          target="_blank"
                                          rel="noreferrer"
                                          className={secondaryButtonClassName}
                                        >
                                          Abrir en YouTube
                                        </a>

                                        {isProfessor ? (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteRequest(video)
                                            }
                                            disabled={
                                              deletingVideoId === video.id
                                            }
                                            className={primaryButtonClassName}
                                          >
                                            {deletingVideoId === video.id
                                              ? "Borrando..."
                                              : "Borrar"}
                                          </button>
                                        ) : null}
                                      </div>
                                    </div>
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
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                <p className="font-display text-3xl uppercase tracking-[0.08em] text-white">
                  No hay videos para esa combinacion.
                </p>
                <p className="mt-4 text-sm leading-7 text-white/65">
                  Proba cambiar la semana o volver a mostrar todos los tipos.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
