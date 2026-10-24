export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={"mb-10 max-w-3xl " + (align === "center" ? "mx-auto text-center" : "")}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-7 text-slate-300">{description}</p>}
    </div>
  );
}
