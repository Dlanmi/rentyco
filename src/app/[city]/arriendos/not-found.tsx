import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-ink">
        Esta ciudad aún no está disponible
      </h1>
      <p className="mt-4 font-body text-[15px] text-ink-muted">
        Estamos empezando por Bogotá. Entra allá para ver los arriendos disponibles.
      </p>
      <Link
        href="/bogota/arriendos"
        className="mt-8 inline-flex rounded-xl bg-teal px-6 py-3 font-heading text-[14px] font-600 text-white no-underline shadow-lg shadow-teal/20 hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        Ver arriendos en Bogotá
      </Link>
    </div>
  );
}
