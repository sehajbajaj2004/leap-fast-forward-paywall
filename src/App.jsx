import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import {
  TrendingUp, Award, ArrowRight,
  ChevronDown, ChevronUp, MessageCircle, FileText,
  Link2, CheckCircle2, Briefcase, Star,
  DollarSign, Globe, BookOpen, Calendar,
  FastForward, Rocket, Heart,
  BadgeCheck, Banknote, ShieldCheck,
  BarChart2, Flag, CheckCheck, Zap, Users, MapPin, Plane, Target
} from 'lucide-react'

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg: '#FFF8F3',
  bg2: '#FFF1E8',
  card: '#FFFFFF',
  orange: '#F97316',
  orangeDark: '#EA580C',
  coral: '#F43F5E',
  coral2: '#FB7185',
  amber: '#D97706',
  emerald: '#059669',
  violet: '#7C3AED',
  cyan: '#0891B2',
  text: '#1C0A00',
  textSub: '#57534E',
  textMuted: '#A8A29E',
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const student = {
  name: 'Arjun Sharma',
  firstName: 'Arjun',
  undergrad: 'B.Tech Computer Science',
  cgpa: '7.5',
  workExp: '3 yrs · Software Engineer',
  country: 'Canada',
  intake: 'September 2025',
  currentSalary: 36,
  projectedSalary: 63,
  projectedCAD: 'CAD 1,02,000',
  projectedINR: '₹63L/yr',
}

const scorecard = [
  { label: 'Post-Study Work Visa', value: '3 Years', sub: 'Work anywhere in Canada', IconComp: ShieldCheck, color: C.emerald },
  { label: 'Monthly Living Cost', value: '₹80K/mo', sub: 'CAD ~1,300/month', IconComp: Globe, color: C.cyan },
]

const expenseBreakdown = [
  { label: 'Tuition (2 years)', amount: '₹32L', detail: 'CAD ~52,000/year · university fees' },
  { label: 'Living costs (2 years)', amount: '₹16L', detail: 'CAD ~1,300/month · rent, food, transit' },
  { label: 'Travel & miscellaneous', amount: '₹3L', detail: 'Flights, setup costs, books' },
  { label: 'Study permit & health insurance', amount: '₹1L', detail: 'Canada-specific · OHIP + permit fees' },
]

const breakEvenData = [
  { month: 'Grad', investment: 52, earnings: 0 },
  { month: '6m', investment: 52, earnings: 5.4 },
  { month: '1yr', investment: 52, earnings: 16.2 },
  { month: '18m', investment: 52, earnings: 32.4 },
  { month: '2yr', investment: 52, earnings: 48.6 },
  { month: '2.2yr', investment: 52, earnings: 53 },
  { month: '3yr', investment: 52, earnings: 72.9 },
]

const fiveYearData = [
  { year: 'Yr 1', income: 9, expenses: 27 },
  { year: 'Yr 2', income: 18, expenses: 27 },
  { year: 'Yr 3', income: 64, expenses: 24 },
  { year: 'Yr 4', income: 70, expenses: 21 },
  { year: 'Yr 5', income: 77, expenses: 19 },
]

const scholarships = [
  { name: 'Vanier Canada Graduate Scholarship', amount: '₹2.5L', amountNum: 2.5, type: 'Merit-Based', match: '98%', deadline: 'Nov 2025' },
  { name: 'International Excellence Award', amount: '₹1.5L', amountNum: 1.5, type: 'University Grant', match: '94%', deadline: 'Jan 2026' },
  { name: 'AAUW International Fellowship', amount: '₹1.5L', amountNum: 1.5, type: 'Fellowship', match: '87%', deadline: 'Dec 2025' },
]

const careers = [
  { role: 'Senior Software Engineer', canadaSalary: '₹67.9L/yr', canadaInr: 'CAD 1,10,000', indiaSalary: '₹41.2L/yr', uplift: '+65%', demand: 'Very High', demandColor: C.orange },
  { role: 'ML / AI Engineer', canadaSalary: '₹77.1L/yr', canadaInr: 'CAD 1,25,000', indiaSalary: '₹45.4L/yr', uplift: '+70%', demand: 'Explosive', demandColor: C.emerald },
  { role: 'Product Manager (Tech)', canadaSalary: '₹70.9L/yr', canadaInr: 'CAD 1,15,000', indiaSalary: '₹47.3L/yr', uplift: '+50%', demand: 'High', demandColor: C.violet },
]

const topHirers = [
  { name: 'Amazon', color: '#FF9900' },
  { name: 'Google', color: '#4285F4' },
  { name: 'Shopify', color: '#96BF48' },
  { name: 'Microsoft', color: '#00A4EF' },
  { name: 'RBC', color: '#003168' },
  { name: 'TD Bank', color: '#00843D' },
  { name: 'IBM', color: '#1F70C1' },
  { name: 'Deloitte', color: '#86BC25' },
  { name: 'Salesforce', color: '#00A1E0' },
  { name: 'Accenture', color: '#A100FF' },
]

const peers = [
  {
    name: 'Priya M.', initial: 'P',
    details: 'B.Tech CSE → Masters CS, Canada (2022)',
    quote: 'Coming in with TCS experience gave me a huge edge in interviews. Got 3 offers before graduation.',
    outcome: '₹1.2Cr CTC at Amazon Canada',
    years: '3 yrs exp · 7.8 CGPA', stars: 5, accentColor: C.orange,
  },
  {
    name: 'Karan S.', initial: 'K',
    details: 'B.Tech CSE → Masters CS, Canada (2023)',
    quote: 'The PGWP was a game-changer. I converted my internship into a full-time role without any visa stress.',
    outcome: '₹70.9L/yr at Shopify',
    years: '2 yrs exp · 7.2 CGPA', stars: 5, accentColor: C.coral,
  },
  {
    name: 'Neha R.', initial: 'N',
    details: 'B.Tech CSE → Masters CS, Canada (2021)',
    quote: 'The co-op network was everything. My first co-op paid CAD 28/hr and became my full-time job.',
    outcome: '₹1.05Cr CTC at Google Canada',
    years: '4 yrs exp · 8.1 CGPA', stars: 4, accentColor: C.violet,
  },
]

const actionPlan = [
  {
    week: 'Week 1–2', date: 'By June 4, 2025',
    title: 'Lock SOP & LORs',
    desc: 'Draft your SOP highlighting TCS work on distributed systems. Request 2 LORs from senior managers at TCS.',
    IconComp: BookOpen, color: C.orange,
  },
  {
    week: 'Week 3', date: 'By June 18, 2025',
    title: 'Apply for Scholarships',
    desc: 'Most Canadian university scholarships need early application alongside admission. Submit your scholarship worksheet now.',
    IconComp: Award, color: C.amber,
  },
  {
    week: 'Week 4', date: 'By June 30, 2025',
    title: 'Submit Your Application',
    desc: 'Your 7.5 CGPA + 3yr TCS experience is above the 50th percentile. Early applications get better scholarship consideration.',
    IconComp: Rocket, color: C.emerald,
  },
]

const acts = [
  { num: '', title: 'The Finance Breakdown', desc: 'Total costs, break-even & scholarships', icons: [TrendingUp, Banknote, BarChart2], color: C.amber },
  { num: '', title: "You're Going to the Right Place", desc: 'Career paths & salary uplift', icons: [Globe, Plane, MapPin], color: C.coral },
  { num: '', title: 'People Like You Made It', desc: 'Real peer outcomes', icons: [Users, Heart, BadgeCheck], color: C.violet },
  { num: '', title: "Here's Exactly What To Do", desc: 'Your 30-day action plan', icons: [Rocket, Target, Flag], color: C.emerald },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let frame = 0
    const totalFrames = Math.round((duration / 1000) * 60)
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)
    const timer = setInterval(() => {
      frame++
      const progress = easeOut(Math.min(frame / totalFrames, 1))
      setCount(Math.floor(progress * target))
      if (frame >= totalFrames) { setCount(target); clearInterval(timer) }
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  }),
}

function InView({ children, className = '', style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className={className} style={style}>
      {children}
    </motion.div>
  )
}

// ─── CARD COMPONENT ────────────────────────────────────────────────────────
function Card({ children, className = '', style = {}, accent = null }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{
      background: C.card,
      border: `1px solid ${accent ? `${accent}22` : 'rgba(0,0,0,0.07)'}`,
      boxShadow: accent
        ? `0 4px 24px ${accent}14, 0 1px 4px rgba(0,0,0,0.04)`
        : '0 2px 16px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────
function SectionLabel({ num, label, color = C.orange }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
        style={{ background: `${color}15`, color }}>{num}</span>
      <h3 className="font-bold text-base" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>{label}</h3>
    </div>
  )
}

// ─── STAR RATING ──────────────────────────────────────────────────────────
function StarRating({ stars, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={13} fill={i < stars ? C.amber : 'transparent'}
          style={{ color: i < stars ? C.amber : 'rgba(0,0,0,0.15)' }} />
      ))}
    </div>
  )
}

// ─── SALARY GAUGE ─────────────────────────────────────────────────────────
function SalaryGauge({ projected, current, max = 90, inView: active }) {
  const count = useCountUp(projected, 1800, active)
  const pct = Math.min(projected / max, 1)
  const uplift = Math.round(((projected - current) / current) * 100)
  const cx = 110, cy = 100, r = 80, sw = 14
  const arcLen = Math.PI * r
  const filled = pct * arcLen
  const dashOffset = arcLen - filled
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`${cx - r - 16} ${cy - r - 14} ${(r + 16) * 2} ${r + 36}`}
        width="100%" style={{ maxWidth: 270, overflow: 'visible' }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.orange} />
            <stop offset="60%" stopColor={C.coral} />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path d={arcPath} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={sw} strokeLinecap="round" />
        {/* Fill */}
        <motion.path d={arcPath} fill="none" stroke="url(#gaugeGrad)" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={arcLen}
          initial={{ strokeDashoffset: arcLen }}
          animate={{ strokeDashoffset: active ? dashOffset : arcLen }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
        {/* Center number */}
        <text x={cx} y={cy - 22} textAnchor="middle" fill={C.text} fontSize="34"
          fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">₹{count}L</text>
        <text x={cx} y={cy - 4} textAnchor="middle" fill={C.textMuted} fontSize="11"
          fontFamily="Inter, sans-serif">Lakhs / year</text>
      </svg>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs px-2.5 py-1 rounded-full font-bold"
          style={{ background: `${C.emerald}15`, color: C.emerald, border: `1px solid ${C.emerald}25` }}>
          +{uplift}% vs India
        </span>
        <span className="text-xs" style={{ color: C.textMuted }}>vs ₹{current}L now</span>
      </div>
    </div>
  )
}

// ─── ACT DIVIDER ──────────────────────────────────────────────────────────
function ActDivider({ act }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [I1] = act.icons
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="my-6 mx-4 md:mx-auto max-w-4xl">
      <div className="rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${act.color}0A, ${act.color}05)`,
          borderLeft: `4px solid ${act.color}`,
          border: `1px solid ${act.color}25`,
          borderLeftWidth: 4,
          boxShadow: `0 4px 20px ${act.color}10`,
        }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${act.color}18`, border: `1px solid ${act.color}30` }}>
          <I1 size={22} style={{ color: act.color }} />
        </div>
        <div className="flex-1">
          {/* <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: act.color }}> {act.num}</p> */}
          <h2 className="font-extrabold text-lg leading-tight" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>{act.title}</h2>
          <p className="text-xs mt-0.5" style={{ color: C.textSub }}>{act.desc}</p>
        </div>
        <span className="hidden md:block flex-shrink-0"
          style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 60, fontWeight: 900, color: act.color, opacity: 0.07, lineHeight: 1 }}>
          {act.num}
        </span>
      </div>
    </motion.div>
  )
}

// ─── CHART TOOLTIP ────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-sm" style={{
      background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', color: C.text,
    }}>
      <p className="text-xs font-semibold mb-1" style={{ color: C.textSub }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || C.orange }}>
          {p.name}: <span className="font-bold">₹{p.value}L</span>
        </p>
      ))}
    </div>
  )
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-12 pb-10">
      {/* Warm gradient bg */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, #FFF8F3 0%, #FFF1E8 55%, #FFE8D6 100%)` }} />
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `radial-gradient(circle, ${C.orange}18 1px, transparent 1px)`,
        backgroundSize: '28px 28px'
      }} />
      {/* Blobs */}
      <div className="absolute pointer-events-none" style={{ top: '5%', right: '8%', width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${C.orange}18 0%, transparent 70%)`, filter: 'blur(48px)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '5%', width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${C.coral}12 0%, transparent 70%)`, filter: 'blur(40px)' }} />

      <div className="relative z-10 text-center max-w-2xl w-full mx-auto">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: '#FFFFFF', color: C.orange, border: `1px solid ${C.orange}30`, boxShadow: `0 2px 16px ${C.orange}20` }}>
            <FastForward size={12} /> Leap Fast Forward Report
          </span>
        </motion.div>

        {/* Personal greeting */}
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-base font-semibold mb-3" style={{ color: C.textSub }}>
          Prepared exclusively for <span style={{ color: C.text, fontWeight: 800 }}>{student.name}</span>
        </motion.p>

        {/* Big headline */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(28px,5.5vw,52px)', lineHeight: 1.1, letterSpacing: '-1.5px' }}
          className="mb-3">
          <span style={{ color: C.text }}>Your Roadmap to a </span>
          <span style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.coral})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Master's in CS
          </span>
          <br />
          <span style={{ color: C.text }}>in Canada </span>
          <span style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.violet})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            is here.
          </span>
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mb-7" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="flex flex-col items-center">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown size={20} style={{ color: C.orange, opacity: 0.6 }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 1: PROJECTED SALARY ──────────────────────────────────────────
function Section1() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <InView className="px-4 max-w-5xl mx-auto mt-6 mb-6">
      <SectionLabel num="01" label="Projected Starting Salary" color={C.orange} />
      <Card accent={C.orange}>
        <div ref={ref} className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-full md:w-64">
            <SalaryGauge projected={student.projectedSalary} current={student.currentSalary} max={90} inView={inView} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="p-3 rounded-xl" style={{ background: `${C.orange}08`, border: `1px solid ${C.orange}18` }}>
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: C.textSub }}>Current salary in India, Projected in Canada</span>
                {/* <span style={{ color: C.textSub }}>Projected in Canada</span> */}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm" style={{ color: C.text }}>₹{student.currentSalary}L</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${(student.currentSalary / student.projectedSalary) * 100}%` } : { width: 0 }}
                    transition={{ duration: 0.9, delay: 0.5 }}
                    style={{ background: `linear-gradient(90deg, ${C.orange}60, ${C.orange}30)` }} />
                </div>
                <span className="font-bold text-sm" style={{ color: C.orange }}>₹{student.projectedSalary}L</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </InView>
  )
}

// ─── SECTION 6: CAREER PATHS ──────────────────────────────────────────────
function Section6() {
  return (
    <InView className="px-4 max-w-5xl mx-auto mb-6">
      <SectionLabel num="02" label="Career Paths for You" color={C.coral} />
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        {careers.map((c, i) => (
          <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Card className="h-full flex flex-col" accent={C.coral}>
              {/* Top accent strip */}
              <div className="h-1.5 rounded-full mb-4"
                style={{ background: `linear-gradient(90deg, ${C.coral}, ${c.demandColor})` }} />
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${C.coral}12`, color: C.coral }}>
                  <Briefcase size={17} />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                  style={{ background: `${c.demandColor}12`, color: c.demandColor }}>{c.demand}</span>
              </div>
              <h4 className="font-bold text-base mb-3" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>{c.role}</h4>
              <div className="mt-auto pt-3" style={{ borderTop: `1px solid rgba(0,0,0,0.06)` }}>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl p-2.5" style={{ background: `${C.coral}08`, border: `1px solid ${C.coral}15` }}>
                    <p className="text-xs mb-1" style={{ color: C.textMuted }}>🍁 Canada</p>
                    <p className="font-bold text-sm leading-tight" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>{c.canadaSalary}</p>
                    <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{c.canadaInr}</p>
                  </div>
                  <div className="rounded-xl p-2.5" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                    <p className="text-xs mb-1" style={{ color: C.textMuted }}>🇮🇳 India</p>
                    <p className="font-bold text-sm leading-tight" style={{ color: C.textSub, fontFamily: 'Plus Jakarta Sans' }}>{c.indiaSalary}</p>
                    <p className="text-xs mt-0.5 font-bold" style={{ color: C.emerald }}>{c.uplift} uplift</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Companies that hire */}
      <div className="rounded-2xl px-4 py-4" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.textMuted }}>Companies that hire for these roles in Canada</p>
        <div className="flex flex-wrap gap-2">
          {topHirers.map((co, i) => (
            <motion.span key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: `${co.color}10`, border: `1px solid ${co.color}30`, color: C.textSub }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: co.color }} />
              {co.name}
            </motion.span>
          ))}
        </div>
      </div>
    </InView>
  )
}

// ─── SECTION 2: COUNTRY SCORECARD ─────────────────────────────────────────
function Section2() {
  const [expanded, setExpanded] = useState(false)
  return (
    <InView className="px-4 max-w-5xl mx-auto mb-6">
      <SectionLabel num="03" label="Canada at a Glance" color={C.amber} />
      <div className="grid grid-cols-2 gap-3 mb-4">
        {scorecard.map((item, i) => {
          const { IconComp } = item
          return (
            <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="text-center h-full" accent={item.color}>
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: `${item.color}15`, color: item.color }}>
                  <IconComp size={18} />
                </div>
                <p className="text-xl font-black mb-0.5" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>{item.value}</p>
                <p className="text-xs font-semibold mb-1" style={{ color: C.textSub }}>{item.label}</p>
                <p className="text-xs" style={{ color: C.textMuted }}>{item.sub}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card>
        <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}
          className="w-full flex items-center justify-between cursor-pointer" style={{ background: 'none', border: 'none', padding: 0, color: 'inherit' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.amber}15` }}>
              <DollarSign size={15} style={{ color: C.amber }} />
            </div>
            <span className="font-bold text-sm" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>Total Cost Breakdown</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: `${C.amber}15`, color: C.amber, border: `1px solid ${C.amber}25` }}>₹52L Total</span>
          </div>
          <span style={{ color: C.textMuted }}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
              <div className="mt-4 space-y-3 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                {expenseBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.text }}>{item.label}</p>
                      <p className="text-xs" style={{ color: C.textMuted }}>{item.detail}</p>
                    </div>
                    <span className="font-bold text-base" style={{ color: C.amber, fontFamily: 'Plus Jakarta Sans' }}>{item.amount}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${C.amber}20` }}>
                  <span className="font-bold" style={{ color: C.text }}>Total</span>
                  <span className="font-black text-xl" style={{ color: C.amber, fontFamily: 'Plus Jakarta Sans' }}>₹52L</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </InView>
  )
}

// ─── SECTION 3: BREAK EVEN ────────────────────────────────────────────────
function Section3() {
  return (
    <InView className="px-4 max-w-5xl mx-auto mb-6">
      <SectionLabel num="04" label="Break Even Time" color={C.orange} />
      <Card accent={C.orange}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
          <div>
            <p className="text-xs mb-1" style={{ color: C.textSub }}>You break even in</p>
            <div className="flex items-baseline gap-1">
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(36px,6vw,52px)', lineHeight: 1,
                background: `linear-gradient(135deg, ${C.orange}, ${C.coral})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                2.2
              </span>
              <span className="text-xl font-bold ml-1" style={{ color: C.text }}>years</span>
            </div>
            <p className="text-xs mt-1" style={{ color: C.textMuted }}>Cumulative earnings cross total investment ~26 months post-graduation</p>
          </div>
          <div className="flex gap-6 md:ml-auto">
            {[{ l: 'Investment', v: '₹52L', c: C.textSub }, { l: 'Annual earning', v: '₹64L', c: C.orange }].map(x => (
              <div key={x.l} className="text-center">
                <p className="text-xs mb-0.5" style={{ color: C.textMuted }}>{x.l}</p>
                <p className="font-bold" style={{ color: x.c, fontFamily: 'Plus Jakarta Sans' }}>{x.v}</p>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={breakEvenData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="investment" stroke="rgba(0,0,0,0.18)" strokeWidth={1.5}
              dot={false} name="Investment" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="earnings" stroke={C.orange} strokeWidth={2.5} name="Earnings"
              activeDot={{ r: 5, fill: C.orange, stroke: C.coral, strokeWidth: 2 }}
              dot={(props) => {
                const { cx, cy, payload } = props
                if (payload.month !== '2.2yr') return null
                return (
                  <g key="intersection">
                    <circle cx={cx} cy={cy} r={14} fill={C.orange} opacity={0.12} />
                    <circle cx={cx} cy={cy} r={8} fill={C.orange} opacity={0.25} />
                    <circle cx={cx} cy={cy} r={5} fill={C.orange} stroke={C.coral} strokeWidth={2} />
                  </g>
                )
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </InView>
  )
}

// ─── SECTION 4: 5-YEAR PROJECTION ─────────────────────────────────────────
function Section4() {
  const [expanded, setExpanded] = useState(false)
  return (
    <InView className="px-4 max-w-5xl mx-auto mb-6">
      <SectionLabel num="05" label="5-Year Projection" color={C.amber} />
      <Card>
        <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}
          className="w-full flex items-center justify-between cursor-pointer" style={{ background: 'none', border: 'none', padding: 0, color: 'inherit' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.amber}15` }}>
              <TrendingUp size={15} style={{ color: C.amber }} />
            </div>
            <span className="font-bold text-sm" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>Year-by-Year Income vs Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs hidden sm:inline" style={{ color: C.textMuted }}>Tap to expand</span>
            <span style={{ color: C.textMuted }}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
          </div>
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} style={{ overflow: 'hidden' }}>
              <div className="pt-5 mt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: C.emerald }} />
                    <span className="text-xs font-semibold" style={{ color: C.textSub }}>Income</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: C.coral2 }} />
                    <span className="text-xs font-semibold" style={{ color: C.textSub }}>Expenses</span>
                  </div>
                  <span className="text-xs ml-auto" style={{ color: C.textMuted }}>Yr 1–2 = during studies</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={fiveYearData} barGap={4} barSize={26}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="year" tick={{ fill: C.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="income" name="Income" radius={[4, 4, 0, 0]}>
                      {fiveYearData.map((_, i) => <Cell key={i} fill={C.emerald} fillOpacity={i < 2 ? 0.45 : 1} />)}
                    </Bar>
                    <Bar dataKey="expenses" name="Expenses" radius={[4, 4, 0, 0]}>
                      {fiveYearData.map((_, i) => <Cell key={i} fill={C.coral2} fillOpacity={0.6} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-center mt-2" style={{ color: C.textMuted }}>
                  Yr 3 onwards: post-graduation salary. Expenses include living costs, loan EMI & tax.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </InView>
  )
}

// ─── SECTION 5: SCHOLARSHIPS ──────────────────────────────────────────────
function Section5() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const count = useCountUp(10, 1800, inView)
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <InView className="px-4 max-w-5xl mx-auto mb-6">
      <SectionLabel num="06" label="Scholarships Available" color={C.emerald} />
      <div ref={ref}>
        <Card className="mb-4" accent={C.emerald}>
          <p className="text-xs mb-3" style={{ color: C.textSub }}>Scholarships you're eligible for</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-1">
              <span style={{
                background: `linear-gradient(135deg, ${C.orange}, ${C.emerald})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(48px,8vw,64px)', lineHeight: 1
              }}>{count}%</span>
            </div>
            <div className="w-px self-stretch" style={{ background: 'rgba(0,0,0,0.08)' }} />
            <div className="flex-1">
              <p className="font-black text-2xl mb-0.5" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>₹5.5L</p>
              <p className="text-xs leading-relaxed" style={{ color: C.textSub }}>of your ₹52L total investment covered across 3 programs</p>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
            <motion.div className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: '10%' } : { width: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.emerald})` }} />
          </div>
          <p className="text-xs mt-1.5" style={{ color: C.textMuted }}>10% of total investment recovered before you start earning</p>
        </Card>
      </div>

      <div className="overflow-x-auto pb-3 -mx-4">
        <div className="flex gap-3 px-4" style={{ minWidth: 'max-content' }}>
          {scholarships.map((s, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} onClick={() => setActiveIdx(i)}
              className="rounded-2xl p-4 flex-shrink-0 cursor-pointer"
              style={{
                width: 260,
                background: activeIdx === i ? `linear-gradient(135deg, ${C.orange}10, ${C.coral}08)` : '#FFFFFF',
                border: `1px solid ${activeIdx === i ? C.orange + '35' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: activeIdx === i ? `0 4px 20px ${C.orange}18` : '0 2px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: `${C.violet}12`, color: C.violet }}>{s.type}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: `${C.emerald}12`, color: C.emerald }}>{s.match}</span>
              </div>
              <h4 className="font-bold text-sm mb-3 leading-snug" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>{s.name}</h4>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, color: C.orange }}>{s.amount}</span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.05)', color: C.textMuted }}>Due {s.deadline}</span>
              </div>
            </motion.div>
          ))}
          <div className="w-4 flex-shrink-0" aria-hidden />
        </div>
      </div>

      <div className="flex gap-2 mt-3 justify-center">
        {scholarships.map((_, i) => (
          <button key={i} onClick={() => setActiveIdx(i)} aria-label={`Scholarship ${i + 1}`}
            className="rounded-full cursor-pointer transition-all duration-200"
            style={{ width: i === activeIdx ? 20 : 7, height: 7, background: i === activeIdx ? C.orange : 'rgba(0,0,0,0.15)', border: 'none' }} />
        ))}
      </div>
    </InView>
  )
}

// ─── SECTION 7: PEER OUTCOMES ─────────────────────────────────────────────
function Section7() {
  return (
    <InView className="px-4 max-w-5xl mx-auto mb-6">
      <SectionLabel num="07" label="People Like You Made It" color={C.violet} />
      <p className="text-xs mb-4" style={{ color: C.textMuted }}>
        Real profiles · Masters CS · Canada · Similar background to Arjun
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {peers.map((p, i) => (
          <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Card className="h-full flex flex-col" accent={p.accentColor}>
              {/* Colored top strip */}
              <div className="h-1 rounded-full mb-4"
                style={{ background: `linear-gradient(90deg, ${p.accentColor}, ${p.accentColor}60)` }} />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                  style={{ background: `linear-gradient(135deg, ${p.accentColor}, ${p.accentColor}90)` }}>
                  {p.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: C.text }}>{p.name}</p>
                  <p className="text-xs" style={{ color: C.textMuted }}>{p.years}</p>
                </div>
                <StarRating stars={p.stars} />
              </div>
              <p className="text-xs mb-3" style={{ color: C.textMuted }}>{p.details}</p>
              <blockquote className="text-xs italic mb-4 flex-1 leading-relaxed"
                style={{ color: C.textSub, borderLeft: `2px solid ${p.accentColor}40`, paddingLeft: 10 }}>
                "{p.quote}"
              </blockquote>
              <div className="rounded-xl p-3 text-center"
                style={{ background: `${p.accentColor}10`, border: `1px solid ${p.accentColor}20` }}>
                <p className="text-xs mb-0.5" style={{ color: p.accentColor }}>Current outcome</p>
                <p className="font-bold text-sm" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>{p.outcome}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </InView>
  )
}

// ─── SECTION 8: 30-DAY ACTION PLAN ────────────────────────────────────────
function Section8() {
  const milestones = [
    { label: 'Today', sub: 'May 2025', IconComp: Zap, color: C.textMuted, done: true },
    { label: 'SOP + LORs Done', sub: 'June 4', IconComp: CheckCheck, color: C.orange, done: false },
    { label: 'Scholarship Filed', sub: 'June 18', IconComp: Award, color: C.amber, done: false },
    { label: 'Application Submitted', sub: 'June 30', IconComp: Rocket, color: C.emerald, done: false },
  ]

  return (
    <InView className="px-4 max-w-5xl mx-auto mb-6">
      <SectionLabel num="08" label="Your 30-Day Action Plan" color={C.emerald} />

      {/* Journey map */}
      <div className="relative mb-5 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex items-center gap-0 min-w-max">
          {milestones.map((m, i) => {
            const { IconComp } = m
            return (
              <div key={i} className="flex items-center">
                <motion.div custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="flex flex-col items-center w-28">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mb-2"
                    style={{
                      background: m.done ? 'rgba(0,0,0,0.06)' : `${m.color}15`,
                      border: `2px solid ${m.done ? 'rgba(0,0,0,0.15)' : m.color}`,
                      boxShadow: m.done ? 'none' : `0 0 16px ${m.color}25`,
                    }}>
                    <IconComp size={16} style={{ color: m.done ? C.textMuted : m.color }} />
                  </div>
                  <p className="text-xs font-bold text-center leading-tight" style={{ color: C.text }}>{m.label}</p>
                  <p className="text-xs text-center" style={{ color: C.textMuted }}>{m.sub}</p>
                </motion.div>
                {i < milestones.length - 1 && (
                  <div className="w-16 h-0.5 mb-10 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.1)' }}>
                    <motion.div className="h-full rounded-full"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.15 }}
                      style={{ background: `linear-gradient(90deg, ${milestones[i].color}, ${milestones[i + 1].color})` }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Action cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {actionPlan.map((step, i) => {
          const { IconComp } = step
          return (
            <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card accent={step.color}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${step.color}15`, color: step.color }}>
                    <IconComp size={15} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: step.color }}>{step.week}</span>
                </div>
                <h4 className="font-bold text-sm mb-1" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>{step.title}</h4>
                <div className="flex items-center gap-1.5 mb-2">
                  <Calendar size={11} style={{ color: C.textMuted }} />
                  <span className="text-xs" style={{ color: C.textMuted }}>{step.date}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: C.textSub }}>{step.desc}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </InView>
  )
}

// ─── SECTION 9: SHARE WITH PARENTS ────────────────────────────────────────
function Section9() {
  const [sharing, setSharing] = useState(null)
  return (
    <InView className="px-4 max-w-5xl mx-auto mb-6">
      <SectionLabel num="09" label="Share With Parents" color={C.coral} />
      <Card accent={C.coral}>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: `${C.coral}12`, border: `1px solid ${C.coral}20` }}>
            <Heart size={22} style={{ color: C.coral }} />
          </div>
          <p className="font-bold text-base mb-1" style={{ color: C.text, fontFamily: 'Plus Jakarta Sans' }}>Share this report with your family</p>
          <p className="text-xs" style={{ color: C.textSub }}>Let them see the full picture — salary, costs, and timeline</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {[
            { key: 'whatsapp', label: 'Share on WhatsApp', Icon: MessageCircle, color: '#25D366', bg: 'rgba(37,211,102,0.1)' },
            { key: 'pdf', label: 'Download PDF', Icon: FileText, color: C.orange, bg: `${C.orange}10` },
            { key: 'link', label: 'Copy Link', Icon: Link2, color: C.violet, bg: `${C.violet}10` },
          ].map(btn => (
            <motion.button key={btn.key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setSharing(btn.key); setTimeout(() => setSharing(null), 2000) }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
              style={{ background: sharing === btn.key ? btn.color : btn.bg, color: sharing === btn.key ? '#fff' : btn.color, border: `1px solid ${btn.color}30`, transition: 'all 0.2s' }}>
              {sharing === btn.key ? <CheckCircle2 size={15} /> : <btn.Icon size={15} />}
              {sharing === btn.key ? 'Done!' : btn.label}
            </motion.button>
          ))}
        </div>
      </Card>
    </InView>
  )
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement
      const pct = d.scrollHeight - d.clientHeight
      setProgress(pct > 0 ? (d.scrollTop / pct) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: 3,
        width: `${progress}%`,
        background: `linear-gradient(90deg, ${C.orange}, ${C.coral})`,
        zIndex: 9999, transition: 'width 0.1s linear',
        boxShadow: `0 0 10px ${C.orange}60`,
      }} />

      {/* Sticky CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,248,243,0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid rgba(0,0,0,0.08)`,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
      }}>
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="hidden sm:block">
            <p className="text-sm font-bold" style={{ color: C.text }}>Ready to make it happen, {student.firstName}?</p>
            <p className="text-xs" style={{ color: C.textMuted }}>Your September 2026 application window is open</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm cursor-pointer text-white"
            style={{
              background: `linear-gradient(135deg, ${C.orange}, ${C.coral})`,
              border: 'none',
              boxShadow: `0 4px 20px ${C.orange}40`,
              whiteSpace: 'nowrap', fontFamily: 'Plus Jakarta Sans',
            }}>
            Discuss this Plan with an Expert
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>

      <div style={{ paddingBottom: 72 }}>
        <HeroSection />
        <Section1 />
        <Section6 />
        <ActDivider act={acts[0]} />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <ActDivider act={acts[2]} />
        <Section7 />
        <ActDivider act={acts[3]} />
        <Section8 />
        <Section9 />
        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
