import React, { useState, useEffect, useRef } from "react"
import {
  motion, useInView, AnimatePresence,
  useScroll, useSpring, useMotionValueEvent,
} from "motion/react"
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback"
import logo from "@/imports/trelantis-mark.png"
import logoDark from "@/imports/trelantis-logo-dark.png"
import {
  FileText, File, MessageSquare, ArrowRight, Check, Menu, X,
  Sparkles, Command, CalendarCheck, Users, Scale,
  Mail, Package, TrendingUp,
} from "lucide-react"
import { Toaster, toast } from "sonner"
import { useIsMobile } from "@/app/components/ui/use-mobile"

// ─── motion tokens (Emil Kowalski-style: fast, confident, purposeful) ─────────
const EASE      = [0.32, 0.72, 0, 1] as const   // signature ease-out
const EASE_OUT  = [0.16, 1, 0.3, 1] as const     // long, soft settle
const SPRING     = { type: "spring", stiffness: 400, damping: 30, mass: 0.9 } as const

// ─── injected styles ──────────────────────────────────────────────────────────
const InjectStyles = () => (
  <style>{`
    *, *::before, *::after { font-family: 'Geist', sans-serif; box-sizing: border-box; }
    .mono { font-family: 'Geist Mono', monospace !important; }
    html  { scroll-behavior: smooth; }
    body  { background: #fff; }
    ::selection { background: rgba(42,43,124,0.14); }

    /* refined scrollbar — quiet, brand-tinted */
    ::-webkit-scrollbar { width: 11px; height: 11px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(42,43,124,0.16); border-radius: 999px; border: 3px solid #fff; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(42,43,124,0.28); }

    /* preserved motions */
    @keyframes orb1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(28px,-22px)} 66%{transform:translate(-18px,14px)} }
    @keyframes orb2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-24px,18px)} 66%{transform:translate(20px,-12px)} }
    @keyframes orb3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-10px)} }
    .orb1 { animation: orb1 20s ease-in-out infinite; }
    .orb2 { animation: orb2 26s ease-in-out infinite; }
    .orb3 { animation: orb3 32s ease-in-out infinite; }
    @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
    @keyframes shimmerBtn { 0%{background-position:200% center} 100%{background-position:-200% center} }
    .btn-shimmer { background: linear-gradient(90deg,#1e1f6b 0%,#2a2b7c 30%,#3a3da0 50%,#2a2b7c 70%,#1e1f6b 100%) !important; background-size:300% 100% !important; animation:shimmerBtn 3s linear infinite; }
    @keyframes dpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.7)} }
    .dp { animation:dpulse 2.8s ease-in-out infinite; }
    @keyframes dataflow { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
    @keyframes ambientA { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(60px,-40px) scale(1.08)} 70%{transform:translate(-30px,50px) scale(0.96)} }
    @keyframes ambientB { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-50px,30px) scale(1.06)} 65%{transform:translate(40px,-20px) scale(1.02)} }
    @keyframes ambientC { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,40px) scale(1.04)} }
    .amb-a { animation: ambientA 28s ease-in-out infinite; }
    .amb-b { animation: ambientB 36s ease-in-out infinite; }
    .amb-c { animation: ambientC 42s ease-in-out infinite; }
    @keyframes scanLine { 0%{top:0%;opacity:0} 6%{opacity:1} 90%{opacity:1} 100%{top:100%;opacity:0} }
    @keyframes dashFlow { from{stroke-dashoffset:14} to{stroke-dashoffset:0} }
    @keyframes needleEnter { from{transform:rotate(-90deg)} 80%{transform:rotate(58deg)} to{transform:rotate(50deg)} }
    @keyframes needleRock  { 0%,100%{transform:rotate(50deg)} 50%{transform:rotate(36deg)} }
    .needle-enter { animation: needleEnter 1.2s ease-out forwards; }
    .needle-loop  { animation: needleRock 3s ease-in-out infinite; }

    /* new, quiet additions */
    @keyframes sheen { 0%{transform:translateX(-120%)} 100%{transform:translateX(220%)} }
    @keyframes gridDrift { 0%{background-position:0 0} 100%{background-position:56px 56px} }
    @keyframes caret { 0%,49%{opacity:1} 50%,100%{opacity:0} }
    @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }

    .link-underline { position: relative; }
    .link-underline::after { content:""; position:absolute; left:0; right:0; bottom:-6px; height:1.5px; background: var(--ink); transform: scaleX(0); transform-origin: left; transition: transform 260ms cubic-bezier(0.32,0.72,0,1); border-radius: 2px; }
    .link-underline:hover::after { transform: scaleX(1); }

    .card-sheen { position: relative; overflow: hidden; }
    .card-sheen::before { content:""; position:absolute; top:0; left:0; width:40%; height:100%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.5), transparent); transform: translateX(-120%); pointer-events:none; opacity:0; transition: opacity 200ms ease; }
    .card-sheen:hover::before { opacity:1; animation: sheen 900ms cubic-bezier(0.32,0.72,0,1); }

    .form-input:focus { outline: none; border-color: var(--ink) !important; box-shadow: 0 0 0 3px rgba(42,43,124,0.08); }

    .hero-sub { white-space: nowrap; }
    @media (max-width: 767px) {
      .hero-sub { white-space: normal; max-width: 320px; }
      .hero-btns { flex-direction: column; width: 100%; max-width: 280px; margin-left: auto; margin-right: auto; }
      .hero-btn { width: 100% !important; }
    }
    @media (min-width: 768px) { .mob-only { display: none !important; } }
    .nav-logo { height: 30px; }
    @media (min-width: 768px) { .nav-logo { height: 38px; } }

    @media (prefers-reduced-motion: reduce) {
      *,*::before,*::after { animation-duration:.01ms!important; transition-duration:.01ms!important; }
    }
  `}</style>
)

// ─── primitives ───────────────────────────────────────────────────────────────
const MonoLabel = ({ children, style = {}, className = "" }: {
  children: React.ReactNode; style?: React.CSSProperties; className?: string
}) => (
  <span className={`mono uppercase ${className}`}
    style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", ...style }}>
    {children}
  </span>
)

// Section eyebrow — a plain, understated label (index kept for call-site compat, unused)
const Eyebrow = ({ index, children, light = false }: {
  index?: string; children: React.ReactNode; light?: boolean
}) => (
  <div style={{ marginBottom: 16 }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: light ? "rgba(255,255,255,0.6)" : "var(--ink)", letterSpacing: 0 }}>
      {children}
    </span>
  </div>
)

// Back-compat alias used where a bare label reads best
const SectionLabel = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <Eyebrow light={light}>{children}</Eyebrow>
)

const FadeUp = ({ children, delay = 0, className = "", style = {}, y = 20 }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties; y?: number
}) => (
  <motion.div className={className} style={style}
    initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: EASE }}>
    {children}
  </motion.div>
)

// Orchestrated stagger container + item
const Stagger = ({ children, className = "", style = {}, gap = 0.07 }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; gap?: number
}) => (
  <motion.div className={className} style={style}
    initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
    variants={{ show: { transition: { staggerChildren: gap } } }}>
    {children}
  </motion.div>
)
const stagItem = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const btnHover = {
  ink:   { y: -2, boxShadow: "0 10px 30px rgba(42,43,124,0.30)"  },
  amber: { y: -2, boxShadow: "0 10px 30px rgba(227,175,101,0.35)" },
  ghost: { y: -2, boxShadow: "0 8px 22px rgba(0,0,0,0.10)"       },
}

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

// Ambient gradient layer — drop inside any section with position:relative, overflow:hidden
const AmbientGlow = ({ variant = "light" }: { variant?: "light" | "dark" }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
    {variant === "light" ? (
      <>
        <div className="amb-a" style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(42,43,124,0.045) 0%, transparent 65%)", top: "-20%", right: "-10%", filter: "blur(80px)" }} />
        <div className="amb-b" style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,167,66,0.04) 0%, transparent 65%)", bottom: "-10%", left: "5%", filter: "blur(72px)" }} />
        <div className="amb-c" style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(42,43,124,0.03) 0%, transparent 65%)", top: "40%", left: "45%", filter: "blur(64px)" }} />
      </>
    ) : (
      <>
        <div className="amb-a" style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,167,66,0.07) 0%, transparent 65%)", top: "-15%", left: "20%", filter: "blur(90px)" }} />
        <div className="amb-b" style={{ position: "absolute", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(42,43,124,0.18) 0%, transparent 65%)", bottom: "-5%", right: "10%", filter: "blur(80px)" }} />
      </>
    )}
  </div>
)

// Faint dot-grid — the connective "data" texture used across sections
const DotGrid = ({ opacity = 0.5, dark = false }: { opacity?: number; dark?: boolean }) => (
  <div aria-hidden style={{
    position: "absolute", inset: 0, pointerEvents: "none", opacity,
    backgroundImage: `radial-gradient(${dark ? "rgba(255,255,255,0.10)" : "rgba(42,43,124,0.10)"} 0.8px, transparent 0.8px)`,
    backgroundSize: "28px 28px",
    maskImage: "radial-gradient(ellipse 90% 70% at 50% 40%, #000 0%, transparent 100%)",
    WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 40%, #000 0%, transparent 100%)",
  }} />
)

// ─── CYCLING HEADLINE ────────────────────────────────────────────────────────
function CyclingHeadline({ fontSize }: { fontSize: string }) {
  const words = ["reasoning", "resilience", "clarity", "intelligence"]
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting" | "pausing">("typing")

  useEffect(() => {
    const word = words[wordIndex]
    let t: ReturnType<typeof setTimeout>
    if (phase === "typing") {
      if (displayed.length < word.length) {
        t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90)
      } else {
        t = setTimeout(() => setPhase("holding"), 40)
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("deleting"), 2200)
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 60)
      } else {
        t = setTimeout(() => setPhase("pausing"), 40)
      }
    } else {
      t = setTimeout(() => {
        setWordIndex(i => (i + 1) % words.length)
        setPhase("typing")
      }, 320)
    }
    return () => clearTimeout(t)
  }, [displayed, phase, wordIndex])

  const capitalize = (s: string) => s.length ? s[0].toUpperCase() + s.slice(1) : ""
  const showCursor = phase !== "holding"

  return (
    <span style={{ display: "block" }}>
      {/* Line 1 — typewriter word, centered, never affects line 2 */}
      <span style={{ display: "block", fontSize, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1.02 }}>
        <span style={{ fontStyle: "normal", color: "var(--ink)" }}>
          {capitalize(displayed)}
        </span>
        {showCursor && (
          <span style={{ fontStyle: "normal", fontWeight: 300, color: "var(--amber)", animation: "blink 0.75s step-start infinite", display: "inline-block", marginLeft: 2, opacity: 1 }}>|</span>
        )}
      </span>
      {/* Line 2 — always static, one step smaller */}
      <span style={{ display: "block", fontSize: "clamp(25px, 4.8vw, 52px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--graphite)", marginTop: 6, whiteSpace: "nowrap" }}>
        before every commitment.
      </span>
    </span>
  )
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // page scroll progress → thin rail beneath the nav
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 })

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn, { passive: true })
    fn()
    return () => { clearTimeout(t); window.removeEventListener("scroll", fn) }
  }, [])

  // Close mobile menu on scroll
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false)
  }, [scrolled])

  const links = [
    { label: "What We Offer", id: "platform"      },
    { label: "How It Works", id: "how-it-works"  },
    { label: "Pricing",      id: "pricing"       },
  ]

  const handleLink = (id: string) => { scrollTo(id); setMobileOpen(false) }

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: visible ? 0 : -24, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 72,
          background: scrolled || mobileOpen ? "rgba(247,248,250,0.85)" : "rgba(247,248,250,0.55)",
          backdropFilter: "blur(16px) saturate(1.4)",
          WebkitBackdropFilter: "blur(16px) saturate(1.4)",
          borderBottom: scrolled || mobileOpen ? "1px solid var(--hairline)" : "1px solid rgba(228,230,236,0.0)",
          transition: "background 260ms ease, border-color 260ms ease",
        }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
            style={{ display: "block", flexShrink: 0, lineHeight: 0, marginLeft: -4 }}>
            <ImageWithFallback src={logo} alt="Trelantis" className="nav-logo"
              style={{ width: "auto", objectFit: "contain", display: "block" }} />
          </a>

          {/* Desktop links — absolute center */}
          <div className="hidden md:flex" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", alignItems: "center", gap: 34 }}>
            {links.map(l => (
              <a key={l.label} href={`#${l.id}`} className="link-underline"
                onClick={e => { e.preventDefault(); scrollTo(l.id) }}
                style={{ fontSize: 14, fontWeight: 500, color: "var(--slate)", textDecoration: "none", cursor: "pointer", transition: "color 150ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--graphite)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--slate)")}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 10 }}>
            <motion.button
              onClick={() => toast("Sign in is coming soon.", { description: "Request early access below to be first in line.", duration: 5000 })}
              style={{ background: "rgba(42,43,124,0.00)", border: "1px solid var(--hairline)", color: "var(--graphite)", fontSize: 14, fontWeight: 500, padding: "7px 16px", borderRadius: 999, cursor: "pointer" }}
              whileHover={btnHover.ghost as any} whileTap={{ scale: 0.97 }} transition={SPRING}>
              Sign in
            </motion.button>
            <motion.button onClick={() => scrollTo("contact")}
              style={{ background: "var(--ink)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, padding: "8px 20px", borderRadius: 999, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}
              whileHover={{ background: "#232472" }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
              Request Access <ArrowRight size={13} />
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button className="mob-only"
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "var(--graphite)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* scroll progress rail */}
        <motion.div style={{
          position: "absolute", left: 0, bottom: 0, height: 2, width: "100%",
          transformOrigin: "left", scaleX: progress,
          background: "linear-gradient(90deg, var(--ink), var(--amber))",
          opacity: scrolled ? 1 : 0, transition: "opacity 260ms ease",
        }} />
      </motion.nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: EASE }}
            style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 49, background: "rgba(247,248,250,0.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--hairline)", padding: "16px 24px 28px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {links.map((l, i) => (
                <a key={l.label} href={`#${l.id}`}
                  onClick={e => { e.preventDefault(); handleLink(l.id) }}
                  style={{ fontSize: 18, fontWeight: 500, color: "var(--graphite)", textDecoration: "none", padding: "14px 0", borderBottom: i < links.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                  {l.label}
                </a>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
                <button
                  onClick={() => { setMobileOpen(false); toast("Sign in is coming soon.", { description: "Request early access below to be first in line.", duration: 5000 }) }}
                  style={{ background: "rgba(42,43,124,0.00)", border: "1px solid var(--hairline)", color: "var(--graphite)", fontSize: 15, fontWeight: 500, padding: "12px", borderRadius: 999, cursor: "pointer" }}>
                  Sign in
                </button>
                <button onClick={() => handleLink("contact")}
                  style={{ background: "var(--ink)", border: "none", color: "#fff", fontSize: 15, fontWeight: 600, padding: "13px", borderRadius: 999, cursor: "pointer" }}>
                  Request Access
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroPanelCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let W = canvas.width = canvas.offsetWidth || 740
    let H = canvas.height = canvas.offsetHeight || 340

    type P = { x: number; y: number; vx: number; vy: number; r: number; amber: boolean }
    const pts: P[] = Array.from({ length: 32 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.4 + 0.5,
      amber: i % 7 === 0,
    }))

    const ctx = canvas.getContext("2d")!
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 95) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(42,43,124,${0.09 * (1 - d / 95)})`
            ctx.lineWidth = 0.7
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.fillStyle = p.amber ? `rgba(227,175,101,0.45)` : `rgba(42,43,124,0.22)`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const ro = new ResizeObserver(() => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 18, opacity: 1, pointerEvents: "none" }} />
}

function HeroPanel() {
  const mobile = useIsMobile()
  const rows = [
    { n: 1, title: "Fee cap exposure under variable scope",     body: "Framework cap may be insufficient given the open-ended deliverable schedule in Schedule 3.", tag: "COMMERCIAL", amber: true,  active: true  },
    { n: 2, title: "Delivery dependency on client data access", body: "Timeline obligations assume Day 1 data room access; no cure mechanism if client delays.",    tag: "STRUCTURAL", amber: false, active: false },
    { n: 3, title: "Cross-service obligation conflict",         body: "Advisory obligations in clause 7.2 conflict with limitation language in Annex B.",           tag: "COMMERCIAL", amber: true,  active: false },
    { n: 4, title: "Staffing substitution restrictions",        body: "Named-individual clause limits substitution with 14-day notice requirement.",                 tag: "STRUCTURAL", amber: false, active: false },
  ]
  const visibleRows = mobile ? rows.slice(0, 2) : rows

  const matters = [
    { name: "Pearson Hardman · Strategic Advisory", active: true,  dot: "var(--ink)"   },
    { name: "Lockhart Gardner · M&A Framework",     active: false, dot: "var(--amber)" },
    { name: "Crane Poole Schmidt · Digital",        active: false, dot: "var(--ink)"   },
    { name: "Hamlin McGill · Restructuring",        active: false, dot: "var(--amber)" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: EASE }}
      style={{ maxWidth: 760, width: "100%", margin: "48px auto 0", position: "relative" }}>

      {/* ── the product screen (static) ── */}
      <div style={{ borderRadius: 18, border: "1px solid rgba(42,43,124,0.12)", boxShadow: "0 40px 90px rgba(42,43,124,0.16), 0 0 0 1px rgba(42,43,124,0.05)", background: "#fff", overflow: "hidden", position: "relative" }}>

        <HeroPanelCanvas />

        {/* window chrome */}
        <div style={{ position: "relative", zIndex: 1, height: mobile ? 36 : 44, background: "rgba(247,248,250,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: mobile ? "0 10px" : "0 16px", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: mobile ? 7 : 10, height: mobile ? 7 : 10, borderRadius: "50%", background: c }} />)}
            </div>
            {!mobile && <MonoLabel style={{ color: "var(--mist)", fontSize: 10 }}>Pearson Hardman · Strategic Advisory</MonoLabel>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "dpulse 1.8s ease-in-out infinite" }} />
              {!mobile && <span style={{ fontSize: 11, color: "var(--mist)" }}>Analysis complete</span>}
            </div>
            <span className="mono" style={{ fontSize: mobile ? 9 : 11, color: "#7c5a1e", background: "rgba(227,175,101,0.14)", border: "1px solid rgba(227,175,101,0.28)", borderRadius: 999, padding: "2px 8px" }}>5 findings</span>
          </div>
        </div>

        {/* AI omnibox — hidden on mobile */}
        {!mobile && (
          <div style={{ position: "relative", zIndex: 1, padding: "10px 16px", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(6px)", borderBottom: "1px solid var(--hairline)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--hairline)", borderRadius: 10, padding: "8px 12px", boxShadow: "var(--shadow-card)" }}>
              <Sparkles size={14} style={{ color: "var(--amber)", flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: "var(--mist)" }}>Ask about this engagement</span>
              <span style={{ width: 1.5, height: 13, background: "var(--ink)", animation: "caret 1s step-start infinite", marginLeft: -4 }} />
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "var(--mist)", background: "var(--surface-subtle)", border: "1px solid var(--hairline)", borderRadius: 6, padding: "2px 6px" }}>
                  <Command size={9} /> K
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", minHeight: mobile ? 180 : 300, position: "relative", zIndex: 1 }}>
          <div className="hidden md:flex flex-col" style={{ width: 190, background: "rgba(247,248,250,0.85)", backdropFilter: "blur(6px)", borderRight: "1px solid var(--hairline)", flexShrink: 0 }}>
            <MonoLabel style={{ color: "var(--mist)", padding: "14px 14px 8px", display: "block" }}>Matters</MonoLabel>
            {matters.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 14px", background: m.active ? "#fff" : "transparent", borderLeft: m.active ? "3px solid var(--ink)" : "3px solid transparent" }}>
                <div style={{ width: 6, height: 6, borderRadius: 999, background: m.dot, flexShrink: 0, marginTop: 5 }} />
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--graphite)", lineHeight: 1.3 }}>{m.name}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, padding: mobile ? 12 : 18, background: "rgba(255,255,255,0.82)", backdropFilter: "blur(4px)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: mobile ? 10 : 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: mobile ? 13 : 15, fontWeight: 600, color: "var(--graphite)" }}>Commercial Considerations</span>
              <span style={{ fontSize: mobile ? 10 : 12, color: "var(--mist)" }}>5 identified · ranked by exposure</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: mobile ? 6 : 10 }}>
              {visibleRows.map(row => (
                <motion.div key={row.n}
                  animate={row.active ? { boxShadow: ["0 0 0 0px rgba(227,175,101,0)", "0 0 0 3px rgba(227,175,101,0.28)", "0 0 0 0px rgba(227,175,101,0)"] } : {}}
                  transition={row.active ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" } : {}}
                  style={{ border: `1px solid ${row.active ? "rgba(227,175,101,0.5)" : "var(--hairline)"}`, borderRadius: mobile ? 8 : 12, padding: mobile ? "8px 10px" : "12px 16px", background: row.active ? "rgba(227,175,101,0.07)" : "#fff", boxShadow: "var(--shadow-card)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 12 }}>
                    <div className="mono" style={{ width: mobile ? 16 : 20, height: mobile ? 16 : 20, borderRadius: 999, background: "var(--ink)", color: "#fff", fontSize: mobile ? 8 : 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{row.n}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: mobile ? 11 : 13, fontWeight: 600, color: "var(--graphite)" }}>{row.title}</div>
                      {!mobile && <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2, lineHeight: 1.5 }}>{row.body}</div>}
                    </div>
                    <MonoLabel style={{ fontSize: mobile ? 8 : 10, borderRadius: 999, padding: "2px 6px", background: row.amber ? "rgba(227,175,101,0.14)" : "rgba(42,43,124,0.07)", color: row.amber ? "#7c5a1e" : "var(--ink)", flexShrink: 0 }}>{row.tag}</MonoLabel>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.96))", pointerEvents: "none", borderRadius: "0 0 18px 18px" }} />
      </div>

      {/* ── mobile highlight cards ── */}
      {mobile && (
        <div style={{ display: "flex", gap: 10, marginTop: 14, padding: "0 4px" }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
            style={{ flex: 1, background: "#fff", border: "1px solid rgba(42,43,124,0.12)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--amber)" }} />
              <MonoLabel style={{ color: "var(--mist)", fontSize: 8 }}>Ranked by exposure</MonoLabel>
            </div>
            {[
              { label: "Fee cap",  v: 92, color: "#e5675f" },
              { label: "Conflict", v: 74, color: "#e5675f" },
              { label: "Delivery", v: 52, color: "var(--amber)" },
              { label: "Staffing", v: 33, color: "#35b37e" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: i < 3 ? 7 : 0 }}>
                <span style={{ width: 40, fontSize: 9, color: "var(--slate)", flexShrink: 0 }}>{b.label}</span>
                <div style={{ flex: 1, height: 5, background: "var(--hairline)", borderRadius: 999, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.v}%` }}
                    transition={{ duration: 0.8, delay: 1 + i * 0.1, ease: EASE }}
                    style={{ height: "100%", borderRadius: 999, background: b.color }} />
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85, ease: EASE }}
            style={{ flex: 1, background: "#fff", border: "1px solid rgba(227,175,101,0.4)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--amber)" }} />
              <MonoLabel style={{ color: "var(--mist)", fontSize: 8 }}>Source extract</MonoLabel>
            </div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9, color: "var(--slate)", lineHeight: 1.7 }}>
              "…shall not exceed the Cap Amount{" "}
              <span style={{ background: "rgba(227,175,101,0.3)", borderRadius: 2, padding: "0 1px" }}>irrespective of the volume of instructions received</span>…"
            </div>
          </motion.div>
        </div>
      )}

      {/* ── floating highlight cards (desktop only) ── */}
      <div className="hidden lg:block" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 6 }}>

        {/* LEFT highlight — exposure ranking, animated */}
        <motion.div
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease: EASE }}
          style={{ position: "absolute", left: -92, top: 126, width: 234 }}>
          <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "#fff", border: "1px solid rgba(42,43,124,0.12)", borderRadius: 14, boxShadow: "0 24px 60px rgba(42,43,124,0.18), 0 0 0 1px rgba(42,43,124,0.04)", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)" }} />
              <MonoLabel style={{ color: "var(--mist)" }}>Ranked by exposure</MonoLabel>
            </div>
            {[
              { label: "Fee cap",  v: 92, color: "#e5675f" },
              { label: "Conflict", v: 74, color: "#e5675f" },
              { label: "Delivery", v: 52, color: "var(--amber)" },
              { label: "Staffing", v: 33, color: "#35b37e" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 3 ? 11 : 0 }}>
                <span style={{ width: 52, fontSize: 11, color: "var(--slate)", flexShrink: 0 }}>{b.label}</span>
                <div style={{ flex: 1, height: 7, background: "var(--hairline)", borderRadius: 999, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: [`${b.v}%`, `${b.v - 7}%`, `${b.v}%`] }}
                    transition={{ width: { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1 + i * 0.15 } }}
                    style={{ height: "100%", borderRadius: 999, background: b.color }} />
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT highlight — source extract */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: EASE }}
          style={{ position: "absolute", right: -44, bottom: -28, width: 284 }}>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "#fff", border: "1px solid rgba(227,175,101,0.4)", borderRadius: 14, boxShadow: "0 24px 60px rgba(42,43,124,0.20), 0 0 0 1px rgba(42,43,124,0.04)", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)" }} />
              <MonoLabel style={{ color: "var(--mist)" }}>Source extract</MonoLabel>
              <span className="mono" style={{ marginLeft: "auto", fontSize: 9.5, color: "var(--ink)", background: "rgba(42,43,124,0.07)", borderRadius: 999, padding: "2px 8px" }}>FINDING 01</span>
            </div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--slate)", lineHeight: 1.75 }}>
              "…shall not exceed the Cap Amount{" "}
              <span style={{ background: "rgba(227,175,101,0.3)", borderRadius: 2, padding: "0 2px" }}>irrespective of the volume of instructions received</span>…"
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function Hero() {
  return (
    <section id="hero" style={{ position: "relative", minHeight: "94vh", paddingTop: "clamp(120px, 20vw, 184px)", paddingBottom: "clamp(40px, 8vw, 80px)", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.26 }}>
          <defs><pattern id="hdots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="#2A2B7C" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#hdots)" />
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(42,43,124,0.13) 0%, transparent 65%)" }} />
        <div className="orb1" style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(42,43,124,0.11) 0%, transparent 70%)", top: "-18%", left: "4%", filter: "blur(72px)" }} />
        <div className="orb2" style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(227,175,101,0.10) 0%, transparent 70%)", top: "6%", right: "2%", filter: "blur(64px)" }} />
        <div className="orb3" style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(42,43,124,0.07) 0%, transparent 70%)", bottom: "10%", left: "33%", filter: "blur(56px)" }} />
        {/* Subtle data-flow vertical lines */}
        {[12, 28, 50, 72, 88].map((left, i) => (
          <div key={i} style={{ position: "absolute", left: `${left}%`, top: 0, width: 1, height: "100%", overflow: "hidden", opacity: 0.6 }}>
            <div style={{ width: "100%", height: "30%", background: `linear-gradient(180deg, transparent 0%, rgba(42,43,124,${0.06 + i * 0.01}) 50%, transparent 100%)`, animation: `dataflow ${9 + i * 2.3}s linear ${i * 1.4}s infinite` }} />
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, width: "100%", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>

        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          style={{ maxWidth: 860, textAlign: "center", margin: 0 }}>
          <CyclingHeadline fontSize="clamp(44px, 6.6vw, 72px)" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: EASE }}
          className="hero-sub"
          style={{ fontSize: "clamp(14px, 3.6vw, 18px)", color: "var(--graphite)", lineHeight: 1.6, marginTop: 24, textAlign: "center", padding: "0 8px" }}>
          A structured view of where risk sits and where to build resilience into the terms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.33, ease: EASE }}
          className="hero-btns"
          style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 38 }}>
          <motion.button onClick={() => scrollTo("contact")}
            className="btn-shimmer hero-btn"
            style={{ color: "#fff", fontSize: 14, fontWeight: 600, padding: "13px 28px", borderRadius: 999, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            whileHover={{ boxShadow: "0 8px 24px rgba(42,43,124,0.28)" } as any} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            Request Early Access <ArrowRight size={14} />
          </motion.button>
          <motion.button onClick={() => scrollTo("how-it-works")}
            className="hero-btn"
            style={{ background: "rgba(42,43,124,0.00)", color: "var(--ink)", fontSize: 14, fontWeight: 500, padding: "13px 28px", borderRadius: 999, border: "1px solid rgba(42,43,124,0.28)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            whileHover={{ background: "rgba(42,43,124,0.04)", borderColor: "var(--ink)" } as any}
            whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            See how it works <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        <HeroPanel />
      </div>
    </section>
  )
}

// ─── HOW IT WORKS — progressive stepper ──────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", title: "Upload the engagement pack",                  body: "Drop in the RFP, proposal, engagement letter and any side correspondence. No integration, no procurement approval, no seat licence.", ring: false },
    { n: "02", title: "Trelantis reads the documents together",      body: "It reads the whole pack in one pass: scope, obligations, delivery risk, staffing and conflicts between documents.", ring: true  },
    { n: "03", title: "You get your Commercial Commitment Briefing", body: "Every finding tells you what's exposed, how far it reaches and where to act before signing. Fewer findings. Better argued.", ring: false },
  ]

  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: "-100px" })

  // Step delays timed to when the line visually reaches each step
  const stepDelays = [0.15, 0.65, 1.2]

  return (
    <section id="how-it-works" style={{ background: "var(--surface-subtle)", padding: "104px 0", position: "relative", overflow: "hidden" }}>
      <AmbientGlow variant="light" />
      <DotGrid opacity={0.35} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Mobile heading */}
        <div className="lg:hidden" style={{ marginBottom: 40 }}>
          <Eyebrow index="02">The Product</Eyebrow>
          <h2 style={{ fontSize: "clamp(30px,5vw,42px)", fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            From documents to <span style={{ color: "var(--amber)" }}>decision</span>.
          </h2>
          <p style={{ fontSize: 15, color: "var(--slate)", lineHeight: 1.65, marginTop: 14 }}>
            It works across the whole engagement to show where resilience matters most.
          </p>
        </div>

        <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
          <div className="hidden lg:block" style={{ width: "38%", position: "sticky", top: 104, alignSelf: "flex-start" }}>
            <Eyebrow index="02">The Product</Eyebrow>
            <h2 style={{ fontSize: "clamp(34px,4vw,52px)", fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.03em", lineHeight: 1.0 }}>
              From documents to <span style={{ color: "var(--amber)" }}>decision</span>.
            </h2>
            <p style={{ fontSize: 16, color: "var(--slate)", lineHeight: 1.65, marginTop: 20, maxWidth: 360 }}>
              It works across the whole engagement to show where resilience matters most.
            </p>
          </div>

          {/* Progressive stepper */}
          <div ref={containerRef} style={{ flex: 1, minWidth: 280, position: "relative" }}>
            <motion.div className="hidden lg:block"
              style={{ position: "absolute", left: 19, top: 20, bottom: 48, width: 2, background: "linear-gradient(180deg, var(--ink) 0%, rgba(42,43,124,0.22) 100%)", originY: 0, borderRadius: 1 }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={inView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
              transition={{ duration: 1.05, delay: 0.15, ease: EASE }}
            />

            {steps.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
                transition={{ duration: 0.5, delay: stepDelays[i], ease: EASE }}
                style={{ display: "flex", gap: 28, marginBottom: i < 2 ? 52 : 0 }}>
                <div style={{ flexShrink: 0, zIndex: 1, position: "relative" }}>
                  <motion.div className="mono"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.4, delay: stepDelays[i] + 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ width: 40, height: 40, borderRadius: 999, background: "#fff", border: "1px solid var(--hairline)", fontSize: 13, fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: step.ring ? "rgba(227,175,101,0.32) 0px 0px 0px 5px" : "none" }}>
                    {step.n}
                  </motion.div>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <h3 style={{ fontSize: 21, fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.01em", lineHeight: 1.25 }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: "var(--slate)", lineHeight: 1.65, marginTop: 8 }}>{step.body}</p>
                </div>
              </motion.div>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 1.55 }}
              style={{ fontSize: 14, color: "var(--mist)", fontStyle: "italic", marginTop: 8, marginLeft: 68 }}>
              The decision is always yours. Trelantis gives you the reasoning to make it clearly.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PLATFORM BENTO ──────────────────────────────────────────────────────────
function BentoCard({ children, className = "", style = {}, delay = 0 }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; delay?: number
}) {
  return (
    <motion.div className={`flex flex-col overflow-hidden card-sheen ${className}`}
      style={{ background: "#fff", border: "1px solid var(--hairline)", borderRadius: 18, boxShadow: "var(--shadow-card)", cursor: "default", ...style }}
      whileHover={{ y: -4, boxShadow: "rgba(245,167,66,0.18) 0px 20px 56px -8px, rgba(245,167,66,0.12) 0px 0px 0px 1px" } as any}>
      {children}
    </motion.div>
  )
}

const Visual = ({ children, height = 160 }: { children: React.ReactNode; height?: number }) => (
  <div style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--hairline)", minHeight: height, display: "flex", alignItems: "center", justifyContent: "center", padding: "18px", position: "relative", overflow: "hidden" }}>
    {children}
  </div>
)

const CardBody = ({ title, body, tag }: { title: string; body: string; tag?: React.ReactNode }) => (
  <div style={{ padding: "18px 22px", flex: 1 }}>
    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.01em" }}>{title}</div>
    <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 6, lineHeight: 1.62 }}>{body}</p>
    {tag && <div style={{ marginTop: 12 }}>{tag}</div>}
  </div>
)

function CardDocuments() {
  return (
    <BentoCard className="col-span-12 md:col-span-6" delay={0.04}>
      <Visual height={168}>
        <div style={{ position: "relative", width: 188, height: 126 }}>
          {[2, 1, 0].map(o => (
            <div key={o} style={{ position: "absolute", background: "#fff", border: "1px solid var(--hairline)", borderRadius: 7, width: 154, height: 106, left: o * 11, top: o * 8, padding: "11px 13px", display: "flex", flexDirection: "column", gap: 7, boxShadow: o === 0 ? "var(--shadow-card)" : "none" }}>
              {[80, 96, 68, 88, 55, 75].map((w, li) => <div key={li} style={{ height: 4, width: `${w}%`, background: "var(--hairline)", borderRadius: 2 }} />)}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 188, height: 3, background: "rgba(227,175,101,0.24)", borderRadius: 1, animation: "scanLine 2.5s ease-in-out infinite" }} />
      </Visual>
      <CardBody
        title="Reads the full obligation stack"
        body="MSAs, SOWs, framework agreements, side letters and redlines, including the dependencies between them that shape delivery."
        tag={<MonoLabel style={{ color: "var(--mist)", background: "var(--surface-subtle)", border: "1px solid var(--hairline)", borderRadius: 999, padding: "3px 12px", display: "inline-block" }}>PDF · Word · Redline</MonoLabel>}
      />
    </BentoCard>
  )
}

function CardFindings() {
  const seq = [-1, 0, -1, 2]
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % seq.length), 1400)
    return () => clearInterval(t)
  }, [])
  const active = seq[step]

  const rows = [
    { title: "Fee cap exposure",          sub: "Variable scope, fixed ceiling",  amber: true  },
    { title: "Data dependency risk",      sub: "Day 1 access assumed, no cure",  amber: false },
    { title: "Cross-obligation conflict", sub: "Clause 7.2 vs Annex B",          amber: true  },
    { title: "Substitution restriction",  sub: "Named-individual binding",       amber: false },
  ]
  return (
    <BentoCard className="col-span-12 md:col-span-6" delay={0.1}>
      <Visual height={168}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((r, i) => (
            <motion.div key={i}
              animate={{ background: active === i && r.amber ? "rgba(227,175,101,0.08)" : "#fff", scale: active === i ? 1.015 : 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ border: "1px solid var(--hairline)", borderRadius: 7, padding: "8px 11px", display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: r.amber ? "var(--amber)" : "var(--ink)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--graphite)" }}>{r.title}</div>
                <div style={{ fontSize: 11, color: "var(--mist)", marginTop: 2 }}>{r.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Visual>
      <CardBody title="Surfaces what will change the outcome" body="It finds the few terms where one broken assumption hits margin, delivery or the client relationship." />
    </BentoCard>
  )
}

function CardGauge() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [phase, setPhase] = useState<"idle" | "enter" | "loop">("idle")

  useEffect(() => {
    if (!inView) return
    setPhase("enter")
    const t = setTimeout(() => setPhase("loop"), 1400)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <BentoCard className="col-span-12 md:col-span-4" delay={0.06}>
      <Visual height={168}>
        <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg viewBox="0 0 180 100" width="170" height="94">
            <path d="M 18 92 A 72 72 0 0 1 52 32"  fill="none" stroke="var(--hairline)" strokeWidth="9" strokeLinecap="round"/>
            <path d="M 52 32 A 72 72 0 0 1 128 32" fill="none" stroke="var(--mist)"    strokeWidth="9" strokeLinecap="round"/>
            <path d="M 128 32 A 72 72 0 0 1 162 92" fill="none" stroke="var(--amber)"  strokeWidth="9" strokeLinecap="round"/>
            <g style={{ transformOrigin: "90px 92px", transform: phase === "idle" ? "rotate(-90deg)" : undefined, animation: phase === "enter" ? "needleEnter 1.2s ease-out forwards" : phase === "loop" ? "needleRock 3s ease-in-out infinite" : "none" }}>
              <line x1="90" y1="92" x2="90" y2="27" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"/>
            </g>
            <circle cx="90" cy="92" r="4.5" fill="var(--ink)"/>
          </svg>
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", width: 170, fontSize: 9, color: "var(--mist)", letterSpacing: "0.05em", marginTop: 4 }}>
            <span>LOW</span><span>MEDIUM</span><span>HIGH</span>
          </div>
        </div>
      </Visual>
      <CardBody title="Ranked by commercial exposure" body="Each finding is ranked by how likely the assumption is to fail and how far the damage spreads across delivery, cost and the client." />
    </BentoCard>
  )
}

function CardSourceTracing() {
  return (
    <BentoCard className="col-span-12 md:col-span-4" delay={0.12}>
      <Visual height={168}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--slate)", lineHeight: 1.85, background: "#fff", border: "1px solid var(--hairline)", borderRadius: 7, padding: "10px 12px" }}>
            <div>The aggregate fees shall not exceed the</div>
            <div><span style={{ background: "rgba(227,175,101,0.28)", borderRadius: 2, padding: "0 2px" }}>Cap Amount</span> irrespective of instruction</div>
            <div>volume, save where parties agree in</div>
            <div><span style={{ background: "rgba(227,175,101,0.28)", borderRadius: 2, padding: "0 2px" }}>writing</span> to a revision.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="40" height="16" viewBox="0 0 40 16">
              <line x1="0" y1="8" x2="34" y2="8" stroke="var(--mist)" strokeWidth="1.5" strokeDasharray="4 3" style={{ animation: "dashFlow 0.7s linear infinite" }} />
              <polygon points="34,5 40,8 34,11" fill="var(--mist)"/>
            </svg>
            <div style={{ background: "#fff", border: "1px solid var(--hairline)", borderRadius: 7, padding: "8px 12px", flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--graphite)" }}>Fee cap exposure</div>
              <MonoLabel style={{ fontSize: 10, background: "rgba(227,175,101,0.14)", color: "#7c5a1e", borderRadius: 999, padding: "2px 7px", display: "inline-block", marginTop: 4 }}>COMMERCIAL</MonoLabel>
            </div>
          </div>
        </div>
      </Visual>
      <CardBody title="Every finding traces to its source" body="Each finding links to the exact clause behind it, so partners can check the reasoning against the source." />
    </BentoCard>
  )
}

function CardExport() {
  const [chip, setChip] = useState(0)
  const items = [
    { label: "PDF Brief",      Icon: FileText      },
    { label: "Word Document",  Icon: File          },
    { label: "Slack Summary",  Icon: MessageSquare },
  ]
  useEffect(() => {
    const t = setInterval(() => setChip(c => (c + 1) % items.length), 1400)
    return () => clearInterval(t)
  }, [])

  return (
    <BentoCard className="col-span-12 md:col-span-4" delay={0.16}>
      <Visual height={168}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item, i) => {
            const Icon = item.Icon
            return (
              <motion.div key={i}
                animate={{ borderColor: chip === i ? "var(--amber)" : "var(--hairline)", background: chip === i ? "rgba(227,175,101,0.05)" : "#fff" }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, border: "1px solid var(--hairline)" }}>
                <Icon size={14} style={{ color: chip === i ? "var(--amber)" : "var(--ink)", flexShrink: 0, transition: "color 300ms ease" }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--graphite)" }}>{item.label}</span>
              </motion.div>
            )
          })}
        </div>
      </Visual>
      <CardBody title="Exports a partner-ready briefing" body="Findings, source extracts and negotiation flags in one file, ready before the kickoff call." />
    </BentoCard>
  )
}

function FeaturesBento() {
  const FEATURES = [
    { C: CardDocuments,     label: "Reads the obligation stack" },
    { C: CardFindings,      label: "Surfaces the findings"      },
    { C: CardGauge,         label: "Ranks by exposure"          },
    { C: CardSourceTracing, label: "Traces every source"        },
    { C: CardExport,        label: "Exports the briefing"       },
  ]

  const mobile = useIsMobile()
  const secRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start start", "end end"] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (mobile) return
    const idx = Math.max(0, Math.min(FEATURES.length - 1, Math.floor(v * FEATURES.length)))
    setActive(idx)
  })

  const goTo = (i: number) => {
    const el = secRef.current
    if (!el) return
    const top = el.offsetTop + ((i + 0.5) / FEATURES.length) * (el.offsetHeight - window.innerHeight)
    window.scrollTo({ top, behavior: "smooth" })
  }

  const Active = FEATURES[active].C

  if (mobile) {
    return (
      <section id="platform" style={{ background: "var(--surface)", padding: "80px 0", position: "relative", overflow: "hidden" }}>
        <AmbientGlow variant="light" />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <FadeUp>
            <Eyebrow>What we offer</Eyebrow>
            <h2 style={{ fontSize: "clamp(28px,5.5vw,44px)", fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.025em", lineHeight: 1.08 }}>
              Every engagement, checked before you sign.
            </h2>
            <p style={{ fontSize: 15, color: "var(--slate)", marginTop: 14, lineHeight: 1.65 }}>
              Trelantis reads the whole obligation stack and connects what other tools read one document at a time.
            </p>
          </FadeUp>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 36 }}>
            {FEATURES.map((f, i) => {
              const Card = f.C
              return (
                <FadeUp key={i} delay={i * 0.08}>
                  <Card />
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="platform" ref={secRef} style={{ position: "relative", height: `${FEATURES.length * 85}vh`, background: "var(--surface)" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <AmbientGlow variant="light" />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 56, alignItems: "center", flexWrap: "wrap" }}>

            {/* left — heading + stepper */}
            <div style={{ flex: "1 1 380px", minWidth: 280 }}>
              <Eyebrow>What we offer</Eyebrow>
              <h2 style={{ fontSize: "clamp(28px,3.4vw,44px)", fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.025em", maxWidth: 440, lineHeight: 1.08 }}>
                Every engagement, checked before you sign.
              </h2>
              <p style={{ fontSize: 16, color: "var(--slate)", maxWidth: 400, marginTop: 16, lineHeight: 1.65 }}>
                Trelantis reads the whole obligation stack and connects what other tools read one document at a time.
              </p>

              {/* stepper */}
              <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 2 }}>
                {FEATURES.map((f, i) => {
                  const on = i === active
                  return (
                    <button key={i} onClick={() => goTo(i)}
                      style={{ display: "flex", alignItems: "center", gap: 14, background: "none", border: "none", cursor: "pointer", padding: "10px 0", textAlign: "left", width: "100%" }}>
                      <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: on ? "var(--ink)" : "var(--mist)", width: 20, flexShrink: 0, transition: "color 300ms ease" }}>
                        0{i + 1}
                      </span>
                      <span style={{ position: "relative", height: 2, flex: 1, maxWidth: 40, background: "var(--hairline)", borderRadius: 2, overflow: "hidden" }}>
                        <motion.span animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }}
                          style={{ position: "absolute", inset: 0, background: "var(--amber)", transformOrigin: "left", borderRadius: 2 }} />
                      </span>
                      <span style={{ fontSize: 14, fontWeight: on ? 600 : 500, color: on ? "var(--graphite)" : "var(--mist)", transition: "color 300ms ease, font-weight 300ms ease" }}>
                        {f.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* right — one card at a time (crossfade in place, no blank frame) */}
            <div style={{ flex: "1 1 440px", minWidth: 280, position: "relative", minHeight: 320 }}>
              <AnimatePresence initial={false}>
                <motion.div key={active} style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3, ease: EASE }}>
                  <Active />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── BEFORE & AFTER ───────────────────────────────────────────────────────────
function BeforeAfter() {
  const RED = "#f0736f"
  const emails = [
    { from: "M. Sterling", subject: "Re: Framework Agreement — please review", time: "09:14", urgent: false },
    { from: "P. Nakamura", subject: "URGENT: pricing approval needed today",   time: "16:08", urgent: true  },
    { from: "D. Aguilar",  subject: "Scope clarification before sign-off",      time: "08:52", urgent: false },
    { from: "C. Brooks",   subject: "FW: Outstanding items — chasing",          time: "14:37", urgent: true  },
  ]
  const findings = [
    { title: "Fee cap breach risk at current scope",       sub: "Exposure above the agreed ceiling",  tag: "COMMERCIAL", high: true  },
    { title: "Delivery milestone dependency unresolved",   sub: "Day 1 data access, no cure",          tag: "STRUCTURAL", high: false },
    { title: "Cross-obligation conflict: 7.2 vs Annex B",  sub: "Scope and liability inconsistent",    tag: "COMMERCIAL", high: true  },
  ]
  const CARD_H = 404

  return (
    <section style={{ background: "var(--surface-dark)", padding: "104px 0", position: "relative", overflow: "hidden" }}>
      <AmbientGlow variant="dark" />
      <DotGrid opacity={0.5} dark />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <FadeUp>
          <Eyebrow light>See it work</Eyebrow>
          <h2 style={{ fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: 680 }}>
            The same engagement.{" "}
            <span style={{ color: "var(--amber)" }}>Two different</span>{" "}
            positions to negotiate from.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginTop: 16, maxWidth: 560, lineHeight: 1.6 }}>
            Same inbox, same deadline. The difference is what you walk in with.
          </p>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginTop: 48, alignItems: "start" }}>

          {/* ── BEFORE: the partner under pressure ─────────────────── */}
          <FadeUp delay={0.05}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>Before Trelantis</span>
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, overflow: "hidden", height: CARD_H, display: "flex", flexDirection: "column" }}>
              {/* inbox header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Mail size={15} style={{ color: "rgba(255,255,255,0.6)" }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Inbox</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>· 12 threads</span>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(240,115,111,0.16)", color: RED, fontSize: 11.5, fontWeight: 600, borderRadius: 999, padding: "3px 10px" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: RED, animation: "dpulse 1.6s ease-in-out infinite" }} />
                  47 unread
                </span>
              </div>

              {/* email rows fill the card */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {emails.map((e, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.12 + i * 0.08, duration: 0.4, ease: EASE }}
                    style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", borderBottom: "1px solid rgba(255,255,255,0.055)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: e.urgent ? RED : "rgba(255,255,255,0.22)", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>{e.from}</span>
                        {e.urgent && (
                          <span className="mono" style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", color: RED, background: "rgba(240,115,111,0.14)", border: `1px solid rgba(240,115,111,0.3)`, borderRadius: 4, padding: "1px 5px" }}>URGENT</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{e.subject}</div>
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{e.time}</span>
                  </motion.div>
                ))}
              </div>

              {/* looming deadline */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "rgba(240,115,111,0.08)", flexShrink: 0 }}>
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: RED, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)" }}>Engagement sign-off due <strong style={{ color: RED, fontWeight: 600 }}>today · 17:00</strong></span>
              </div>
            </div>

            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, marginTop: 16 }}>
              Days lost across email threads. The exposure is still open at sign-off.
            </p>
          </FadeUp>

          {/* ── AFTER: one clean briefing ──────────────────────────── */}
          <FadeUp delay={0.14}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--amber)", animation: "dpulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>With Trelantis</span>
            </div>

            <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.34)", height: CARD_H, display: "flex", flexDirection: "column" }}>
              {/* briefing header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "var(--surface-subtle)", borderBottom: "1px solid var(--hairline)", flexShrink: 0 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--graphite)" }}>Commercial Commitment Briefing</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#7c5a1e", background: "rgba(227,175,101,0.14)", border: "1px solid rgba(227,175,101,0.3)", borderRadius: 999, padding: "3px 10px" }}>5 findings</span>
              </div>

              {/* finding rows fill the card */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {findings.map((f, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.45, ease: EASE }}
                    style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", borderBottom: "1px solid var(--hairline)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: f.high ? "var(--amber)" : "var(--ink)", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--graphite)", lineHeight: 1.3 }}>{f.title}</div>
                      <div style={{ fontSize: 11.5, color: "var(--slate)", marginTop: 2 }}>{f.sub}</div>
                    </div>
                    <span className="mono" style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.06em", color: f.high ? "#7c5a1e" : "var(--ink)", background: f.high ? "rgba(227,175,101,0.14)" : "rgba(42,43,124,0.07)", border: `1px solid ${f.high ? "rgba(227,175,101,0.28)" : "var(--hairline)"}`, borderRadius: 999, padding: "3px 9px", flexShrink: 0 }}>{f.tag}</span>
                  </motion.div>
                ))}

                {/* remaining findings */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 18px" }}>
                  <span style={{ width: 8, display: "flex", justifyContent: "center", flexShrink: 0, gap: 2 }}>
                    {[0, 1].map(d => <span key={d} style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--mist)" }} />)}
                  </span>
                  <span style={{ fontSize: 12.5, color: "var(--slate)" }}>2 more findings ranked by exposure</span>
                </div>
              </div>

              {/* ready footer */}
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "14px 18px", background: "var(--surface-subtle)", borderTop: "1px solid var(--hairline)", flexShrink: 0 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(34,197,94,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={11} style={{ color: "#16a34a" }} />
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--graphite)" }}>Ready to negotiate before the kickoff call</span>
              </div>
            </div>

            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, marginTop: 16 }}>
              Resilience built into the terms before you sign.
            </p>
          </FadeUp>

        </div>
      </div>
    </section>
  )
}

// ─── PRICING ─────────────────────────────────────────────────────────────────
function Pricing() {
  const mobile = useIsMobile()
  const principles = [
    { Icon: CalendarCheck, title: "Predictable",           body: "Firms can budget for Trelantis without a surprise bill when people actually use it." },
    { Icon: Users,         title: "Designed for adoption", body: "No partner should hesitate over cost before running an important engagement through it." },
    { Icon: Scale,         title: "Aligned with value",    body: "Pricing follows the value of the decisions Trelantis supports." },
    { Icon: MessageSquare, title: "Simple to explain",     body: "A buyer can explain the model to finance and procurement in a sentence." },
  ]

  const expectations = [
    { Icon: Users,      title: "No per-seat penalty for adoption",                  body: "Trelantis gets more useful as the right people use it." },
    { Icon: Package,    title: "Core decision intelligence in the product",         body: "Everything you need to understand an engagement comes in one product, working as one." },
    { Icon: TrendingUp, title: "Commercial terms grounded in real use",             body: "We set pricing from real deployments as we roll out." },
  ]

  return (
    <section id="pricing" style={{ background: "var(--surface-subtle)", padding: "104px 0", position: "relative", overflow: "hidden" }}>
      <AmbientGlow variant="light" />
      <DotGrid opacity={0.3} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <FadeUp>
            <Eyebrow index="05">Pricing</Eyebrow>
            <h2 style={{ fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.025em", lineHeight: 1.12, maxWidth: 620 }}>
              <span style={{ display: "block" }}>Priced by the engagement,</span>
              <span style={{ display: "block" }}>not the seat.</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--slate)", maxWidth: 540, marginTop: 20, lineHeight: 1.68 }}>
              Trelantis works on the decision behind the agreement — the assumptions, dependencies and firm context that decide how it performs.
            </p>

            {/* pull quote */}
            <div style={{ borderLeft: "2px solid var(--amber)", paddingLeft: 18, marginTop: 26, maxWidth: 520 }}>
              <p style={{ fontSize: "clamp(19px,2.1vw,23px)", fontWeight: 500, color: "var(--graphite)", lineHeight: 1.4, letterSpacing: "-0.01em", margin: 0 }}>
                The value of that intelligence isn't set by how many people log in.
              </p>
            </div>

            <p style={{ fontSize: 16, color: "var(--slate)", maxWidth: 540, marginTop: 24, lineHeight: 1.68 }}>
              We're shaping the pricing with our first customers, so it stays fair and predictable as firms grow into it.
            </p>
        </FadeUp>

        {/* ── How We Think About Pricing ───────────────────────────── */}
        <div style={{ marginTop: 88 }}>
          <FadeUp>
            <h3 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.02em" }}>
              How we think about pricing
            </h3>
            <p style={{ fontSize: 15, color: "var(--slate)", marginTop: 10, lineHeight: 1.6 }}>
              We are designing the commercial model around a few principles.
            </p>
          </FadeUp>

          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {principles.map((p, i) => {
              const Icon = p.Icon
              return (
                <motion.div key={p.title}
                  className="card-sheen"
                  initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  style={{ background: "#fff", border: "1px solid var(--hairline)", borderRadius: 18, padding: "26px 24px", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(42,43,124,0.06)", border: "1px solid rgba(42,43,124,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon size={18} style={{ color: "var(--ink)" }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.01em", marginBottom: 8 }}>{p.title}</div>
                  <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.62, margin: 0 }}>{p.body}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── What to Expect ───────────────────────────────────────── */}
        <div style={{ marginTop: 72 }}>
          <FadeUp>
            <h3 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.02em", marginBottom: 24 }}>
              What to expect
            </h3>
          </FadeUp>

          {mobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
              {expectations.map((e, i) => {
                const Icon = e.Icon
                return (
                  <FadeUp key={e.title}>
                    <div style={{ display: "flex", gap: 14, padding: "18px 0", borderBottom: i < expectations.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(227,175,101,0.1)", border: "1px solid rgba(227,175,101,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Icon size={17} style={{ color: "var(--amber)" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{e.title}</div>
                        <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.55, margin: "5px 0 0" }}>{e.body}</p>
                      </div>
                    </div>
                  </FadeUp>
                )
              })}
            </div>
          ) : (
            <div style={{ position: "relative", marginTop: 8 }}>
              <motion.div className="hidden md:block"
                style={{ position: "absolute", top: 28, left: "16%", right: "16%", height: 2, background: "linear-gradient(90deg, transparent, var(--hairline) 20%, var(--hairline) 80%, transparent)", transformOrigin: "left" }}
                initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }} />
              <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32, position: "relative" }}>
                {expectations.map((e) => {
                  const Icon = e.Icon
                  return (
                    <motion.div key={e.title} variants={stagItem}
                      style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <motion.div
                        whileHover={{ scale: 1.06 }} transition={SPRING}
                        style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff", border: "1px solid rgba(227,175,101,0.45)", boxShadow: "0 0 0 6px rgba(227,175,101,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                        <Icon size={22} style={{ color: "var(--amber)" }} />
                      </motion.div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--graphite)", letterSpacing: "-0.01em", marginBottom: 8, maxWidth: 240, lineHeight: 1.3 }}>{e.title}</div>
                      <p style={{ fontSize: 13.5, color: "var(--slate)", lineHeight: 1.6, margin: 0, maxWidth: 260 }}>{e.body}</p>
                    </motion.div>
                  )
                })}
              </Stagger>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}

// ─── GET STARTED + INLINE CONTACT FORM ───────────────────────────────────────
function CTABand() {
  const [form, setForm] = useState({ name: "", firm: "", email: "", message: "" })
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", fontSize: 14, color: "#fff",
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 8, outline: "none", transition: "border-color 160ms ease, box-shadow 160ms ease",
    fontFamily: "'Geist', sans-serif",
  } as React.CSSProperties

  const isWorkEmail = (email: string) => {
    const personal = ["gmail.com","yahoo.com","yahoo.co.in","hotmail.com","outlook.com","live.com","aol.com","icloud.com","me.com","mail.com","protonmail.com","proton.me","ymail.com","gmx.com","zoho.com","rediffmail.com"]
    const domain = email.split("@")[1]?.toLowerCase()
    return domain && !personal.includes(domain)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error("Please fill in your name and email.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.")
      return
    }
    if (!isWorkEmail(form.email)) {
      toast.error("Please use your work email address.")
      return
    }
    setSubmitting(true)
    try {
      const body = new URLSearchParams({
        "form-name": "contact",
        "bot-field": "",
        name: form.name,
        firm: form.firm,
        email: form.email,
        message: form.message,
      })
      const res = await fetch("/.netlify/functions/contact", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() })
      if (!res.ok) throw new Error("submit failed")
      setDone(true)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" style={{ background: "var(--surface-dark)", padding: "104px 0", position: "relative", overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs><pattern id="cta-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.04)"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#cta-dots)" />
      </svg>
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.38, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(227,175,101,0.08) 0%, transparent 70%)", top: "50%", left: "30%", transform: "translate(-50%,-50%)", filter: "blur(60px)", pointerEvents: "none" }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 72, alignItems: "center", flexWrap: "wrap" }}>

          {/* Left — copy */}
          <FadeUp style={{ flex: "0 0 380px", minWidth: 260 }}>
            <Eyebrow index="06" light>Get Started</Eyebrow>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", fontStyle: "italic", marginBottom: 10, letterSpacing: "0.01em" }}>
              Every engagement is a bet on the future.
            </p>
            <h2 style={{ fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.0 }}>
              The decision is always yours.
            </h2>
            <div style={{ marginTop: 30, paddingTop: 26, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--amber)", letterSpacing: "-0.01em" }}>
                Interested in Trelantis?
              </h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginTop: 8 }}>
                If your firm is rethinking how it decides before signing, tell us how you do it today.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 32 }}>
              {[
                "No seat licences or procurement approval",
                "First review completed in under a day",
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 999, background: "rgba(227,175,101,0.14)", border: "1px solid rgba(227,175,101,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={10} style={{ color: "var(--amber)" }} />
                  </div>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)" }}>{p}</span>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Right — inline form */}
          <FadeUp delay={0.12} style={{ flex: 1, minWidth: 280 }}>
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: 36, backdropFilter: "blur(10px)" }}>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.72)", marginBottom: 24 }}>
                      Tell us about your practice and we&apos;ll set up a short walkthrough.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", gap: 10 }}>
                        <input
                          className="form-input"
                          placeholder="Your name"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        <input
                          className="form-input"
                          placeholder="Firm name"
                          value={form.firm}
                          onChange={e => setForm(f => ({ ...f, firm: e.target.value }))}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                      </div>
                      <input
                        className="form-input"
                        type="email"
                        placeholder="Work email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        style={inputStyle}
                      />
                      <textarea
                        className="form-input"
                        placeholder="Types of matters you work on (optional)"
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        rows={3}
                        style={{ ...inputStyle, resize: "none", lineHeight: 1.55 }}
                      />
                      <motion.button
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{ background: "var(--amber)", color: "var(--graphite)", fontSize: 14, fontWeight: 600, padding: "13px", borderRadius: 999, border: "none", cursor: submitting ? "wait" : "pointer", marginTop: 4, opacity: submitting ? 0.7 : 1 }}
                        whileHover={submitting ? {} : btnHover.amber as any} whileTap={submitting ? {} : { scale: 0.97 }} transition={SPRING}>
                        {submitting ? "Sending…" : "Send request"}
                      </motion.button>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.26)", marginTop: 16, textAlign: "center" }}>
                      We respond within one business day.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: 48, backdropFilter: "blur(10px)", textAlign: "center" }}>
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ width: 52, height: 52, borderRadius: 999, background: "rgba(227,175,101,0.18)", border: "1px solid rgba(227,175,101,0.32)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Check size={22} style={{ color: "var(--amber)" }} />
                  </motion.div>
                  <h3 style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>Request received.</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 10, lineHeight: 1.6 }}>
                    We will be in touch within one business day to arrange a walkthrough.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "var(--surface-dark)", padding: "48px 0 40px", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ImageWithFallback src={logoDark} alt="Trelantis" style={{ height: 32, width: "auto", objectFit: "contain" }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.34)" }}>Commercial reasoning for professional services.</span>
        </div>
        <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)" }}>© 2026 Trelantis · Built in Fulcrum Startup Labs</span>
      </div>
    </footer>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ fontFamily: "'Geist', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <InjectStyles />
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: "'Geist', sans-serif" } }} />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturesBento />
        <BeforeAfter />
        <Pricing />
        <CTABand />
      </main>
      <Footer />
    </div>
  )
}
