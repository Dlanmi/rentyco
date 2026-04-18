/**
 * Dark marquee strip — a continuous scroll of uppercase mono slogans
 * separated by coral dots. Sits right below the hero to give the page
 * rhythm and reinforce the brand promise.
 */
const PHRASES = [
  'Tu historial habla por ti',
  'Sin codeudor · Sin fiador · Sin fianza',
  'El arriendo sin barreras',
  'Ley 1581 · Datos encriptados',
  'Hecho en Colombia 🇨🇴',
] as const;

export default function Marquee() {
  // Duplicate the track so the translateX(-50%) loop feels seamless.
  const track = [...PHRASES, ...PHRASES];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-t border-white/5 bg-ink py-4 text-white"
    >
      <div className="renty-marquee flex gap-8 whitespace-nowrap font-mono text-[10px] font-500 tracking-[0.14em] uppercase text-white/60 sm:gap-12 sm:text-[11px]">
        {track.map((p, i) => (
          <span key={i} className="inline-flex items-center gap-3">
            <span>{p}</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral" />
          </span>
        ))}
      </div>
    </div>
  );
}
