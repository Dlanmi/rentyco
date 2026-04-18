# Hardcodes baseline (snapshot pre-DS consistency work)

## 1. Hex literals in .tsx/.ts (ban target)

src/app/como-funciona/Engine.tsx:105:      ? 'bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]'
src/app/como-funciona/Engine.tsx:153:                  <stop offset="0" stopColor="#10B981" />
src/app/como-funciona/Engine.tsx:154:                  <stop offset="1" stopColor="#0D6B58" />
src/app/como-funciona/Engine.tsx:271:                background: 'linear-gradient(90deg, #DC2626 0%, #F59E0B 40%, #16A34A 75%)',
src/app/como-funciona/page.tsx:237:                        style={{ background: 'linear-gradient(135deg, #F0B27A, #C4402A)' }}
src/app/como-funciona/page.tsx:294:                    style={{ background: 'linear-gradient(135deg, #c9bfae 0%, #8b7a62 100%)' }}
src/app/como-funciona/page.tsx:361:                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#F5E5E1] text-coral-dark">
src/app/como-funciona/page.tsx:799:                style={{ background: 'linear-gradient(135deg, #F0B27A, #C4402A)' }}
src/app/como-funciona/page.tsx:1081:          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
src/app/como-funciona/page.tsx:1082:          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
src/app/como-funciona/page.tsx:1083:          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
src/app/como-funciona/page.tsx:1084:          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
src/app/como-funciona/page.tsx:1162:            stroke="#10B981"
src/app/como-funciona/page.tsx:1204:    { h: 'Chapinero Alto', m: '2 hab · 62 m²', p: '$2.450.000', grad: 'linear-gradient(135deg, #d2c4ad, #8b7a62)' },
src/app/como-funciona/page.tsx:1205:    { h: 'Quinta Camacho', m: '1 hab · 48 m²', p: '$1.850.000', grad: 'linear-gradient(135deg, #b8ccc2, #5f8a77)' },
src/app/como-funciona/page.tsx:1206:    { h: 'Teusaquillo', m: '2 hab · 70 m²', p: '$2.100.000', grad: 'linear-gradient(135deg, #e0cac0, #a67e6b)' },
src/app/como-funciona/page.tsx:1207:    { h: 'La Soledad', m: '3 hab · 85 m²', p: '$2.800.000', grad: 'linear-gradient(135deg, #c4bfb0, #736a55)' },
src/app/nosotros/page.tsx:408:                  <rect width="32" height="12" fill="#FCD116" />
src/app/nosotros/page.tsx:409:                  <rect y="12" width="32" height="6" fill="#003893" />
src/app/nosotros/page.tsx:410:                  <rect y="18" width="32" height="6" fill="#CE1126" />
src/app/nosotros/page.tsx:456:              background: 'radial-gradient(circle, #0D6B58, transparent 70%)',
src/app/nosotros/page.tsx:462:              background: 'radial-gradient(circle, #E8634A, transparent 70%)',
src/app/inquilinos/InquilinosMapInner.tsx:31:  const bg = selected ? '#1C1917' : '#FFFFFF';
src/app/inquilinos/InquilinosMapInner.tsx:32:  const fg = selected ? '#FFFFFF' : '#1C1917';
src/app/inquilinos/InquilinosMapInner.tsx:33:  const border = selected ? '#1C1917' : '#0D6B58';
src/app/inquilinos/InquilinosMapInner.tsx:126:        style={{ height: '100%', width: '100%', background: '#F0EDE5' }}
src/app/inquilinos/InquilinosMapInner.tsx:160:                style={{ background: 'linear-gradient(135deg, #d2c4ad, #8b7a62)' }}
src/app/inquilinos/InquilinosTestimonials.tsx:18:    grad: 'linear-gradient(140deg, #d4b896, #8b6f54)',
src/app/inquilinos/InquilinosTestimonials.tsx:32:    grad: 'linear-gradient(140deg, #a89e8a, #5f5142)',
src/app/inquilinos/InquilinosTestimonials.tsx:46:    grad: 'linear-gradient(140deg, #c9a888, #7a5a3f)',
src/app/inquilinos/InquilinosTestimonials.tsx:60:    grad: 'linear-gradient(140deg, #b8a590, #685846)',
src/app/inquilinos/InquilinosScoreDemo.tsx:125:  const toneColor = tone === 'teal' ? '#10B981' : tone === 'amber' ? '#F59E0B' : '#E8634A';
src/app/inquilinos/InquilinosScoreDemo.tsx:176:                  <stop offset="0%" stopColor="#E8634A" />
src/app/inquilinos/InquilinosScoreDemo.tsx:177:                  <stop offset="50%" stopColor="#F59E0B" />
src/app/inquilinos/InquilinosScoreDemo.tsx:178:                  <stop offset="100%" stopColor="#10B981" />
src/app/inquilinos/InquilinosScoreDemo.tsx:192:              <text x="40" y="198" fill="#6B6560" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" textAnchor="middle">300</text>
src/app/inquilinos/InquilinosScoreDemo.tsx:193:              <text x="170" y="18" fill="#6B6560" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" textAnchor="middle">600</text>
src/app/inquilinos/InquilinosScoreDemo.tsx:194:              <text x="300" y="198" fill="#6B6560" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" textAnchor="middle">900</text>
src/app/arrendadores/page.tsx:77:            style={{ background: 'radial-gradient(circle, #0D6B58, transparent 70%)' }}
src/app/arrendadores/page.tsx:81:            style={{ background: 'radial-gradient(circle, #E8634A, transparent 70%)' }}
src/app/arrendadores/page.tsx:237:                <div className="mb-4" style={{ color: '#10B981' }}>
src/app/renty-score/page.tsx:9:  { name: 'Historial de arriendo', weight: '35%', color: '#0D6B58', desc: 'Tu experiencia arrendando: cuánto tiempo llevas, cómo han sido tus pagos y tu comportamiento general como inquilino.' },
src/app/renty-score/page.tsx:10:  { name: 'Capacidad de pago', weight: '30%', color: '#10B981', desc: 'Tu relación ingreso-arriendo y tu capacidad real de cumplir con el canon mensual sin comprometer tus finanzas.' },
src/app/renty-score/page.tsx:11:  { name: 'Estabilidad y comportamiento', weight: '20%', color: '#E8634A', desc: 'Tu continuidad en arriendos anteriores, cómo manejas conflictos y tu comportamiento como vecino.' },
src/app/renty-score/page.tsx:12:  { name: 'Transparencia y verificabilidad', weight: '15%', color: '#F59E0B', desc: 'Tu disposición a verificar tu identidad, proporcionar comprobantes de ingresos y permitir que contactemos a tu arrendador anterior.' },
src/app/renty-score/page.tsx:16:  { range: '750–1000', label: 'Excelente', color: '#0D6B58', desc: 'Tu perfil como inquilino es sólido. Puedes compartir tu score con confianza.' },
src/app/renty-score/page.tsx:17:  { range: '600–749', label: 'Buen camino', color: '#10B981', desc: 'Estás en buen camino. Tu historial muestra señales positivas como inquilino.' },
src/app/renty-score/page.tsx:18:  { range: '400–599', label: 'En construcción', color: '#F59E0B', desc: 'Tu historial está creciendo. Seguir arrendando responsablemente mejorará tu puntaje.' },
src/app/renty-score/page.tsx:19:  { range: '0–399', label: 'Necesita mejorar', color: '#A8A29E', desc: 'Hay aspectos por mejorar. Revisa las recomendaciones para subir tu score.' },
src/app/renty-score/page.tsx:108:                <circle cx="180" cy="180" r="140" stroke="#292524" strokeWidth="14" fill="none" />
src/app/renty-score/page.tsx:109:                <circle data-score-arc cx="180" cy="180" r="140" stroke="#0D6B58" strokeWidth="14" fill="none" strokeLinecap="round" transform="rotate(-90 180 180)" />
src/app/renty-score/page.tsx:111:                <text x="180" y="200" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="12" fill="#A8A29E" letterSpacing="0.14em">RENTY SCORE</text>
src/app/renty-score/page.tsx:112:                <circle data-score-dot cx="75" cy="90" r="5" fill="#0D6B58" />
src/app/renty-score/page.tsx:113:                <circle data-score-dot cx="48" cy="190" r="5" fill="#10B981" />
src/app/renty-score/page.tsx:114:                <circle data-score-dot cx="100" cy="290" r="5" fill="#E8634A" />
src/app/renty-score/page.tsx:115:                <circle data-score-dot cx="260" cy="290" r="5" fill="#F59E0B" />
src/app/renty-score/page.tsx:116:                <circle data-score-dot cx="312" cy="190" r="5" fill="#A8A29E" />
src/app/og/listing/[slug]/route.tsx:16:const TEAL = '#0D6B58';
src/app/og/listing/[slug]/route.tsx:17:const TEAL_LIGHT = '#10B981';
src/app/og/listing/[slug]/route.tsx:18:const CORAL = '#E8634A';
src/app/og/listing/[slug]/route.tsx:136:          backgroundColor: '#1C1917',
src/app/og/[slug]/route.tsx:13:const TEAL = '#0D6B58';
src/app/og/[slug]/route.tsx:14:const TEAL_LIGHT = '#10B981';
src/app/og/[slug]/route.tsx:15:const CORAL = '#E8634A';
src/app/og/[slug]/route.tsx:16:const INK = '#1C1917';
src/app/og/[slug]/route.tsx:17:const SAND = '#FAF7F2';
src/app/og/[slug]/route.tsx:18:const BORDER = '#E7E5E4';
src/app/og/[slug]/route.tsx:19:const MUTED = '#6B6560';
src/app/lista-de-espera/page.tsx:288:              background: 'radial-gradient(circle, #0D6B58, transparent 70%)',
src/app/lista-de-espera/page.tsx:294:              background: 'radial-gradient(circle, #E8634A, transparent 70%)',
src/app/entrar/LoginForm.tsx:25:          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
src/app/entrar/LoginForm.tsx:26:          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
src/app/entrar/LoginForm.tsx:27:          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
src/app/entrar/LoginForm.tsx:28:          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
src/components/sections/Hero.tsx:66:                  stroke="#E8634A"
src/components/sections/Hero.tsx:160:                  background: 'linear-gradient(135deg, #d8cfc2, #a89880 60%, #8b7a62)',
src/components/sections/TrustStrip.tsx:18:        <rect width="32" height="12" fill="#FCD116" />
src/components/sections/TrustStrip.tsx:19:        <rect y="12" width="32" height="6" fill="#003893" />
src/components/sections/TrustStrip.tsx:20:        <rect y="18" width="32" height="6" fill="#CE1126" />
src/components/sections/Testimonial.tsx:124:                  style={{ background: 'linear-gradient(135deg, #E8634A, #0D6B58)' }}

---

## 2. Inline style fontSize (ban target)

src/app/como-funciona/Engine.tsx:132:            style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.05, margin: 0 }}
src/app/como-funciona/Engine.tsx:139:            style={{ fontSize: 19, lineHeight: 1.55 }}
src/app/como-funciona/Engine.tsx:179:                  fontSize: 'clamp(72px, 10vw, 128px)',
src/app/como-funciona/page.tsx:182:                style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.98 }}
src/app/como-funciona/page.tsx:199:                style={{ fontSize: 19, lineHeight: 1.6, margin: '0 0 32px' }}
src/app/como-funciona/page.tsx:258:                    <div className="font-mono font-500 leading-none text-teal [letter-spacing:-0.02em]" style={{ fontSize: 56 }}>
src/app/como-funciona/page.tsx:260:                      <span className="ml-1.5 font-400 text-ink-muted" style={{ fontSize: 22 }}>/1000</span>
src/app/como-funciona/page.tsx:330:                style={{ fontSize: 'clamp(28px, 4.5vw, 56px)', lineHeight: 1.1, margin: '16px auto 14px' }}
src/app/como-funciona/page.tsx:334:              <p className="mx-auto max-w-[56ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
src/app/como-funciona/page.tsx:419:                style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.05 }}
src/app/como-funciona/page.tsx:425:              <p className="mx-auto mt-4 max-w-[56ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
src/app/como-funciona/page.tsx:515:                style={{ fontSize: 'clamp(32px, 5vw, 60px)', lineHeight: 1.05 }}
src/app/como-funciona/page.tsx:521:              <p className="mx-auto mt-4 max-w-[56ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
src/app/como-funciona/page.tsx:598:                style={{ fontSize: 'clamp(28px, 4.5vw, 56px)', lineHeight: 1.1 }}
src/app/como-funciona/page.tsx:602:              <p className="mx-auto mt-4 max-w-[56ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
src/app/como-funciona/page.tsx:691:                style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', lineHeight: 1.1 }}
src/app/como-funciona/page.tsx:697:              <p className="mb-7 mt-4 max-w-[52ch] font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
src/app/como-funciona/page.tsx:789:              style={{ fontSize: 'clamp(22px, 3.5vw, 42px)', lineHeight: 1.25 }}
src/app/como-funciona/page.tsx:791:              <span aria-hidden="true" className="mb-5 block font-display leading-none text-coral" style={{ fontSize: 72, lineHeight: 0.3 }}>&ldquo;</span>
src/app/como-funciona/page.tsx:827:                style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', lineHeight: 1.1 }}
src/app/como-funciona/page.tsx:833:              <p className="mb-7 mt-4 font-body text-ink-secondary" style={{ fontSize: 19, lineHeight: 1.55 }}>
src/app/como-funciona/page.tsx:908:              style={{ fontSize: 'clamp(36px, 6vw, 88px)', lineHeight: 1 }}
src/app/como-funciona/page.tsx:912:            <p className="mx-auto mb-10 max-w-[48ch] font-body text-white/70" style={{ fontSize: 19, lineHeight: 1.55 }}>
src/app/como-funciona/page.tsx:1008:          style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', lineHeight: 1.1 }}
src/app/como-funciona/page.tsx:1012:        <p className="mb-6 font-body text-ink-secondary" style={{ fontSize: 17, lineHeight: 1.6 }}>
src/app/como-funciona/page.tsx:1172:          style={{ fontSize: 56, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
src/app/como-funciona/page.tsx:1175:          <small className="ml-1 font-400 text-white/45" style={{ fontSize: 18 }}>/1000</small>
src/app/inquilinos/InquilinosTestimonials.tsx:138:                  style={{ fontSize: 'clamp(22px, 2.8vw, 28px)', lineHeight: 1.35 }}
src/app/inquilinos/InquilinosTestimonials.tsx:143:                    style={{ fontSize: 80, lineHeight: 1 }}
src/app/inquilinos/InquilinosScoreDemo.tsx:147:            style={{ fontSize: 'clamp(32px, 4.6vw, 54px)', lineHeight: 1.1 }}
src/app/inquilinos/InquilinosScoreDemo.tsx:151:          <p className="mx-auto mt-4 max-w-[60ch] font-body text-white/65" style={{ fontSize: 18, lineHeight: 1.55 }}>
src/app/inquilinos/InquilinosScoreDemo.tsx:200:                fontSize: 72,
src/app/inquilinos/page.tsx:124:              style={{ fontSize: 'clamp(40px, 6.8vw, 88px)', lineHeight: 1.02, margin: '0 auto 28px' }}
src/app/inquilinos/page.tsx:140:              style={{ fontSize: 19, lineHeight: 1.55, margin: '0 auto 36px' }}
src/app/inquilinos/page.tsx:222:                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
src/app/inquilinos/page.tsx:226:              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
src/app/inquilinos/page.tsx:297:                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
src/app/inquilinos/page.tsx:301:              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
src/app/inquilinos/page.tsx:322:                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
src/app/inquilinos/page.tsx:326:              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
src/app/inquilinos/page.tsx:343:                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
src/app/inquilinos/page.tsx:347:              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
src/app/inquilinos/page.tsx:428:                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
src/app/inquilinos/page.tsx:432:              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
src/app/inquilinos/page.tsx:469:                style={{ fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 1.1 }}
src/app/inquilinos/page.tsx:473:              <p className="mx-auto mt-4 max-w-[60ch] font-body text-ink-secondary" style={{ fontSize: 18, lineHeight: 1.55 }}>
src/app/inquilinos/page.tsx:513:              style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, margin: '24px 0' }}
src/app/inquilinos/page.tsx:517:            <p className="mx-auto mb-10 max-w-[56ch] font-body text-white/65" style={{ fontSize: 18, lineHeight: 1.55 }}>
src/app/og/listing/[slug]/route.tsx:194:                  fontSize: '22px',
src/app/og/listing/[slug]/route.tsx:201:              <div style={{ fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>
src/app/og/listing/[slug]/route.tsx:215:              <span style={{ fontSize: '13px', fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
src/app/og/listing/[slug]/route.tsx:225:              <span style={{ fontSize: '48px', fontWeight: 700, fontFamily: 'DM Serif Display', color: 'white', lineHeight: 1 }}>
src/app/og/listing/[slug]/route.tsx:228:              <span style={{ fontSize: '20px', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>
src/app/og/listing/[slug]/route.tsx:236:                fontSize: '28px',
src/app/og/listing/[slug]/route.tsx:254:                <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
src/app/og/listing/[slug]/route.tsx:258:                <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
src/app/og/listing/[slug]/route.tsx:262:                <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
src/app/og/listing/[slug]/route.tsx:267:              <span style={{ fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>
src/app/og/[slug]/route.tsx:136:                  fontSize: '24px',
src/app/og/[slug]/route.tsx:145:                  fontSize: '28px',

---

## 3. Raw Tailwind palette classes (ban target)

src/app/como-funciona/Engine.tsx:106:      : 'bg-red-500/15 border-red-400/30 text-red-300';
src/app/como-funciona/page.tsx:648:                    ? 'bg-red-100 text-red-900'
src/app/como-funciona/page.tsx:650:                    ? 'bg-amber-100 text-amber-900'
src/app/admin/page.tsx:48:          iconBg="bg-green-50"
src/app/admin/page.tsx:49:          iconColor="text-green-600"
src/app/admin/page.tsx:56:          iconBg="bg-amber-50"
src/app/admin/page.tsx:57:          iconColor="text-amber-600"
src/app/admin/page.tsx:63:          iconBg="bg-blue-50"
src/app/admin/page.tsx:64:          iconColor="text-blue-600"
src/app/admin/page.tsx:72:          iconBg="bg-purple-50"
src/app/admin/page.tsx:73:          iconColor="text-purple-600"
src/app/cuenta/perfil/page.tsx:71:            className="rounded-xl border border-red-200 bg-white px-4 py-2 font-heading text-label font-500 text-red-600 transition-colors hover:bg-red-50 hover:border-red-300"
src/app/cuenta/page.tsx:152:        color="text-rose-500"
src/app/cuenta/page.tsx:153:        bg="bg-rose-50"
src/app/cuenta/page.tsx:161:        color="text-blue-500"
src/app/cuenta/page.tsx:162:        bg="bg-blue-50"
src/components/ui/Badge.tsx:7:  success: 'bg-green-50 text-green-800 ring-green-200',
src/components/ui/Badge.tsx:8:  warning: 'bg-amber-50 text-amber-900 ring-amber-200',
src/components/ui/Badge.tsx:9:  error:   'bg-red-50 text-red-800 ring-red-200',
src/components/sections/WaitlistForm.tsx:223:                  className={`mt-1.5 font-body text-[12px] ${dark ? 'text-red-300' : 'text-red-600'}`}
src/components/sections/WaitlistForm.tsx:349:                className={`text-center font-body text-label ${dark ? 'text-red-300' : 'text-red-600'}`}
src/components/layout/AuthAvatar.tsx:205:            className="gap-3 text-red-600 focus:bg-red-50 focus:text-red-700"
src/components/layout/AuthAvatar.tsx:207:            <MenuIcon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" className="text-red-400" />
src/components/admin/ImageUploader.tsx:214:        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow ring-1 ring-border hover:bg-red-50 hover:text-red-700"
src/components/admin/ListingForm.tsx:281:                          p.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-teal/10 text-teal-dark'
src/components/admin/ListingForm.tsx:402:          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3">
src/components/admin/ListingForm.tsx:403:            <div className="font-heading text-label font-600 text-blue-800">Tip para habitaciones</div>
src/components/admin/ListingForm.tsx:404:            <div className="mt-1 font-body text-[12px] text-blue-700">
src/components/admin/ListingForm.tsx:555:    active: { label: 'Activo', cls: 'bg-green-100 text-green-800' },
src/components/admin/ListingForm.tsx:556:    pending_review: { label: 'En revisión', cls: 'bg-amber-100 text-amber-800' },
src/components/admin/ListingForm.tsx:559:    archived: { label: 'Archivado', cls: 'bg-red-100 text-red-800' },
src/components/account/LandlordInquiryCard.tsx:23:  verde: { bg: 'bg-green-50', text: 'text-green-800', label: 'Excelente' },
src/components/account/LandlordInquiryCard.tsx:24:  amarillo: { bg: 'bg-amber-50', text: 'text-amber-900', label: 'Buen camino' },
src/components/account/LandlordInquiryCard.tsx:25:  naranja: { bg: 'bg-orange-50', text: 'text-orange-800', label: 'En construcción' },
src/components/account/LandlordInquiryCard.tsx:26:  rojo: { bg: 'bg-red-50', text: 'text-red-800', label: 'Por mejorar' },
src/components/renty-score/ScoreRecovery.tsx:117:        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
src/components/renty-score/ScoreRecovery.tsx:118:          <Icon icon={ShieldCheck} className="h-6 w-6 text-red-500" />

---

## 4. Inline cubic-bezier (ban target)

src/app/como-funciona/Engine.tsx:169:                style={{ transition: 'stroke-dashoffset 0.25s cubic-bezier(0.16,1,0.3,1)' }}
src/app/como-funciona/Engine.tsx:209:                  className={`grid cursor-pointer grid-cols-[52px_1fr_28px] items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:grid-cols-[60px_1fr_28px] sm:p-5 ${
src/app/como-funciona/page.tsx:213:                  className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] bg-teal px-8 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
src/app/como-funciona/page.tsx:655:                    className="rounded-3xl border border-border bg-white p-7 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-teal hover:shadow-lg sm:p-8"
src/app/como-funciona/page.tsx:949:                className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] bg-coral px-8 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/20"
src/app/inquilinos/InquilinosMapInner.tsx:50:      transition:transform 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms;
src/app/inquilinos/InquilinosTestimonials.tsx:111:          className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
src/app/inquilinos/InquilinosScoreDemo.tsx:190:                style={{ transition: 'stroke-dashoffset 400ms cubic-bezier(0.16,1,0.3,1)' }}
src/app/inquilinos/InquilinosScoreDemo.tsx:256:                className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
src/app/inquilinos/page.tsx:149:                className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
src/app/inquilinos/page.tsx:270:                  className="relative rounded-[20px] border border-border bg-white p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-lg sm:p-9"
src/app/inquilinos/page.tsx:449:                  className="rounded-[20px] border border-border bg-white p-7 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-md sm:p-8"
src/app/inquilinos/page.tsx:524:                className="inline-flex h-[56px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
src/components/sections/Steps.tsx:136:              className="group relative z-[1] rounded-3xl border border-border bg-white p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-lg lg:p-8"
src/components/sections/Steps.tsx:144:                className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-teal-lighter text-teal transition-[background,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:bg-teal group-hover:text-white"
src/components/sections/Hero.tsx:84:              className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
src/components/sections/Hero.tsx:93:              className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] border border-border-strong bg-white px-7 font-heading text-[15px] font-600 text-ink no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-teal hover:text-teal"
src/components/sections/Waitlist.tsx:187:                className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-[14px] bg-coral px-7 font-heading text-[15px] font-600 text-white transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
src/components/sections/Landlords.tsx:122:                className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] bg-teal px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20"
src/components/sections/Score.tsx:120:                  className="group flex cursor-default items-start gap-4 rounded-[14px] border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-1 hover:border-teal-light/30 hover:bg-white/[0.08]"
src/components/sections/Score.tsx:219:                  style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.16,1,0.3,1), stroke 0.3s' }}
src/components/sections/Score.tsx:257:                  className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] bg-coral px-7 font-heading text-[15px] font-600 text-white no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/20"
src/components/sections/Problem.tsx:117:                className={`group relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border p-7 pt-8 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-xl sm:min-h-[380px] sm:p-8 sm:pt-9 ${
src/components/sections/Problem.tsx:124:                  className={`pointer-events-none absolute right-[-24px] top-6 hidden h-[120px] w-[120px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:-rotate-3 sm:block ${
src/components/layout/Navbar.tsx:229:            border-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
src/components/layout/Navbar.tsx:230:            box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1);
src/components/layout/Navbar.tsx:234:            padding-top 300ms cubic-bezier(0.16, 1, 0.3, 1),
src/components/layout/Navbar.tsx:235:            padding-bottom 300ms cubic-bezier(0.16, 1, 0.3, 1);
src/components/layout/Navbar.tsx:248:            max-height 300ms cubic-bezier(0.16, 1, 0.3, 1),
src/components/layout/Navbar.tsx:249:            padding 300ms cubic-bezier(0.16, 1, 0.3, 1),
