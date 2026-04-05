type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionIntro({
  eyebrow,
  title,

  align = "left",
}: SectionIntroProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.08em] text-white md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
