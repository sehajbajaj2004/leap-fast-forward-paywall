import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronDown, Check, ArrowRight, FastForward,
  TrendingUp, Award, Users, Target,
  Shield, Zap, Clock, Star, Lock,
} from 'lucide-react'
import Report from './App.jsx'

// ─── DESIGN TOKENS (mirrors App.jsx) ─────────────────────────────────────────
const C = {
  bg: '#FFF8F3',
  bg2: '#FFF1E8',
  card: '#FFFFFF',
  orange: '#F97316',
  orangeDark: '#EA580C',
  coral: '#F43F5E',
  amber: '#D97706',
  emerald: '#059669',
  violet: '#7C3AED',
  text: '#1C0A00',
  textSub: '#57534E',
  textMuted: '#A8A29E',
}

// ─── ONBOARDING PAGE DATA ─────────────────────────────────────────────────────
// Page 1: Country + Course (MCQ)
const countryOptions = [
  { value: 'canada',    label: 'Canada',    flag: '🇨🇦' },
  { value: 'uk',        label: 'UK',        flag: '🇬🇧' },
  { value: 'usa',       label: 'USA',       flag: '🇺🇸' },
  { value: 'australia', label: 'Australia', flag: '🇦🇺' },
  { value: 'germany',   label: 'Germany',   flag: '🇩🇪' },
  { value: 'ireland',   label: 'Ireland',   flag: '🇮🇪' },
]
const courseOptions = [
  { value: 'cs',      label: 'Computer Science (MS/M.Eng)' },
  { value: 'ds',      label: 'Data Science (MS)' },
  { value: 'ai',      label: 'Artificial Intelligence (MS)' },
  { value: 'ba',      label: 'Business Analytics (MS)' },
  { value: 'mba',     label: 'MBA' },
  { value: 'ee',      label: 'Electrical Engineering (MS)' },
  { value: 'finance', label: 'Finance / FinTech (MS)' },
  { value: 'mgmt',    label: 'Management (MiM)' },
  { value: 'ece',     label: 'Electronics & Comm. (MS)' },
  { value: 'other',   label: 'Other' },
]

// Page 2: CGPA (text input) + Budget (capsules) + Intake (capsules)
const budgetOptions = [
  { value: 'under20', label: 'Below ₹20L' },
  { value: 'under40', label: 'Below ₹40L' },
  { value: 'under60', label: 'Below ₹60L' },
  { value: 'under80', label: 'Below ₹80L' },
]
const intakeOptions = [
  { value: 'sep26', label: 'Sep 2026' },
  { value: 'jan27', label: 'Jan 2027' },
  { value: 'sep27', label: 'Sep 2027' },
]

// ─── POST-PAYMENT QUESTION DATA ───────────────────────────────────────────────
const educationOptions = [
  { value: 'btech',    label: 'B.Tech / B.E.' },
  { value: 'bsc',      label: 'B.Sc' },
  { value: 'bca',      label: 'BCA' },
  { value: 'bcom_bba', label: 'B.Com / BBA' },
  { value: 'mba',      label: 'MBA' },
  { value: 'diploma',  label: 'Diploma' },
  { value: 'other',    label: 'Other' },
]
const specializationOptions = [
  { value: 'cs',       label: 'Computer Science' },
  { value: 'it',       label: 'Information Technology' },
  { value: 'ece',      label: 'Electronics & Comm. (ECE)' },
  { value: 'ee',       label: 'Electrical Engineering' },
  { value: 'mech',     label: 'Mechanical Engineering' },
  { value: 'civil',    label: 'Civil Engineering' },
  { value: 'maths',    label: 'Mathematics / Statistics' },
  { value: 'physics',  label: 'Physics / Applied Sciences' },
  { value: 'commerce', label: 'Commerce / Business' },
  { value: 'finance',  label: 'Finance / Accounting' },
  { value: 'other',    label: 'Other' },
]
const jobRoleOptions = [
  { value: 'swe',         label: 'Software Engineer' },
  { value: 'sde2',        label: 'Software Engineer II / SDE-2' },
  { value: 'fullstack',   label: 'Full Stack Developer' },
  { value: 'backend',     label: 'Backend Developer' },
  { value: 'frontend',    label: 'Frontend Developer' },
  { value: 'devops',      label: 'DevOps / Cloud Engineer' },
  { value: 'data_eng',    label: 'Data Engineer' },
  { value: 'data_analyst',label: 'Data Analyst' },
  { value: 'ml_eng',      label: 'ML / AI Engineer' },
  { value: 'pm',          label: 'Product Manager' },
  { value: 'ba',          label: 'Business Analyst' },
  { value: 'consultant',  label: 'Consultant / Strategy' },
  { value: 'finance_ana', label: 'Finance Analyst' },
  { value: 'qa',          label: 'QA / Test Engineer' },
  { value: 'embedded',    label: 'Embedded / VLSI Engineer' },
  { value: 'research',    label: 'Research Analyst' },
  { value: 'other',       label: 'Other' },
]
const englishTestOptions = [
  { value: 'yes', label: 'Yes, I have' },
  { value: 'no',  label: 'Not yet' },
]

// ─── LOADER MESSAGES ──────────────────────────────────────────────────────────
const loaderMessages = [
  'Analysing your academic profile…',
  'Matching with 2,400+ alumni…',
  'Calculating your salary uplift…',
  'Finding scholarships you qualify for…',
  'Building your personalised report…',
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────
// (no dynamic question filtering needed — all flows are fixed)

// ─── MCQ OPTION BUTTON ────────────────────────────────────────────────────────
function OptionBtn({ option, selected, onClick }) {
  const on = selected === option.value
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(option.value)}
      className="relative flex items-center gap-2.5 px-4 py-3.5 rounded-2xl font-semibold text-sm cursor-pointer text-left w-full"
      style={{
        background: on
          ? `linear-gradient(135deg, ${C.orange}12, ${C.coral}08)`
          : C.card,
        border: `1.5px solid ${on ? C.orange : 'rgba(0,0,0,0.09)'}`,
        color: on ? C.orangeDark : C.text,
        boxShadow: on
          ? `0 4px 18px ${C.orange}22`
          : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'all 0.16s ease',
        fontFamily: on ? 'Plus Jakarta Sans' : 'Inter',
        fontWeight: on ? 700 : 500,
        minHeight: 52,
      }}
    >
      {option.flag && (
        <span className="text-xl leading-none flex-shrink-0">{option.flag}</span>
      )}
      <span className="flex-1 leading-snug">{option.label}</span>
      <motion.span
        initial={false}
        animate={{ scale: on ? 1 : 0.6, opacity: on ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: C.orange }}
      >
        <Check size={11} color="#fff" strokeWidth={3} />
      </motion.span>
    </motion.button>
  )
}

// ─── STYLED DROPDOWN ─────────────────────────────────────────────────────────
function SelectField({ label, id, value, onChange, options, placeholder }) {
  const filled = value && value !== ''
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-wider mb-1.5"
        style={{ color: C.textMuted }}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl px-4 py-3.5 text-sm font-semibold cursor-pointer"
          style={{
            background: filled
              ? `linear-gradient(135deg, ${C.orange}10, ${C.coral}06)`
              : '#FFFFFF',
            border: `1.5px solid ${filled ? C.orange : 'rgba(0,0,0,0.1)'}`,
            color: filled ? C.text : C.textMuted,
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            boxShadow: filled ? `0 2px 12px ${C.orange}14` : '0 1px 4px rgba(0,0,0,0.04)',
            paddingRight: 44,
          }}
        >
          <option value="" disabled>{placeholder || 'Select…'}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown
          size={16}
          style={{
            color: filled ? C.orange : C.textMuted,
            position: 'absolute', right: 14, top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}

// ─── TEXT INPUT FIELD ─────────────────────────────────────────────────────────
function TextField({ label, id, value, onChange, placeholder, hint }) {
  const filled = value && value.trim() !== ''
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider mb-1.5"
        style={{ color: C.textMuted }}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold"
        style={{
          background: filled ? `linear-gradient(135deg, ${C.orange}10, ${C.coral}06)` : '#FFFFFF',
          border: `1.5px solid ${filled ? C.orange : 'rgba(0,0,0,0.1)'}`,
          color: C.text,
          fontFamily: 'Inter, sans-serif',
          outline: 'none',
          boxShadow: filled ? `0 2px 12px ${C.orange}14` : '0 1px 4px rgba(0,0,0,0.04)',
          transition: 'all 0.18s ease',
        }}
        onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orange}18` }}
        onBlur={e => {
          e.target.style.borderColor = filled ? C.orange : 'rgba(0,0,0,0.1)'
          e.target.style.boxShadow = filled ? `0 2px 12px ${C.orange}14` : '0 1px 4px rgba(0,0,0,0.04)'
        }}
      />
      {hint && <p className="text-xs mt-1.5 px-1" style={{ color: C.textMuted }}>{hint}</p>}
    </div>
  )
}

// ─── CONTINUE BUTTON ──────────────────────────────────────────────────────────
function ContinueBtn({ disabled, onClick, label = 'Continue' }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white mt-6"
      style={{
        background: disabled
          ? 'rgba(0,0,0,0.1)'
          : `linear-gradient(135deg, ${C.orange}, ${C.coral})`,
        border: 'none',
        boxShadow: disabled ? 'none' : `0 6px 24px ${C.orange}35`,
        fontFamily: 'Plus Jakarta Sans',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? C.textMuted : '#fff',
        transition: 'all 0.2s ease',
      }}
    >
      {label} <ArrowRight size={16} />
    </motion.button>
  )
}

// ─── FLOW HEADER ──────────────────────────────────────────────────────────────
function FlowHeader({ onBack, canGoBack, label, current, total }) {
  return (
    <div className="px-5 pt-5 pb-4 sticky top-0 z-10"
      style={{ background: C.bg, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between mb-3">
        {canGoBack ? (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.06)', border: 'none' }}
          >
            <ChevronLeft size={18} style={{ color: C.textSub }} />
          </motion.button>
        ) : (
          <div className="w-9" />
        )}
        <span
          className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
          style={{ background: `${C.orange}12`, color: C.orange }}
        >
          {label}
        </span>
        <span className="text-xs font-semibold tabular-nums" style={{ color: C.textMuted }}>
          {current}/{total}
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.coral})` }}
        />
      </div>
    </div>
  )
}

// ─── QUESTION SCREEN (shared layout for onboarding + post-payment) ────────────
function QuestionScreen({ q, answers, onAnswer, onBack, canGoBack, label, current, total }) {
  if (!q) return null
  const options = q.dynamicOptions ? q.dynamicOptions(answers) : q.options

  return (
    <div className="flex flex-col min-h-screen" style={{ background: C.bg }}>
      <FlowHeader onBack={onBack} canGoBack={canGoBack} label={label} current={current} total={total} />

      <div className="flex-1 px-5 pt-6 pb-10">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-extrabold mb-2 leading-tight"
            style={{
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 'clamp(20px,5.5vw,26px)',
              color: C.text,
              letterSpacing: '-0.5px',
            }}
          >
            {q.question}
          </h2>
          {q.subtitle && (
            <p className="text-sm mb-6" style={{ color: C.textSub, lineHeight: 1.5 }}>
              {q.subtitle}
            </p>
          )}
          <div className={q.subtitle ? '' : 'mt-5'}>
            <div className="grid grid-cols-2 gap-3">
              {options.map(opt => (
                <OptionBtn
                  key={opt.value}
                  option={opt}
                  selected={answers[q.id]}
                  onClick={(val) => onAnswer(q.id, val)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── SCREEN 1: ONBOARDING FLOW (2 pages) ─────────────────────────────────────
function OnboardingFlow({ answers, onUpdate, onComplete }) {
  const [page, setPage] = useState(0) // 0 = country+course, 1 = cgpa+budget+intake

  const p1Ready = answers.country && answers.course
  const p2Ready = answers.cgpa && answers.budget && answers.intake

  // Page 1: Country + Course (MCQ grids)
  if (page === 0) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: C.bg }}>
        <FlowHeader onBack={null} canGoBack={false} label="About You" current={1} total={2} />
        <div className="flex-1 px-5 pt-6 pb-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}>

            <h2 className="font-extrabold mb-1 leading-tight"
              style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 'clamp(20px,5.5vw,26px)', color: C.text, letterSpacing: '-0.5px' }}>
              Where & what do you want to study?
            </h2>
            <p className="text-sm mb-5" style={{ color: C.textSub }}>Pick your destination country and course</p>

            {/* Country */}
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textMuted }}>Country</p>
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {countryOptions.map(opt => (
                <OptionBtn key={opt.value} option={opt} selected={answers.country}
                  onClick={val => onUpdate('country', val)} />
              ))}
            </div>

            {/* Course — dropdown */}
            <SelectField label="Course" id="course" value={answers.course}
              onChange={val => onUpdate('course', val)} options={courseOptions}
              placeholder="Select your course" />

            <ContinueBtn disabled={!p1Ready} onClick={() => setPage(1)} />
          </motion.div>
        </div>
      </div>
    )
  }

  // Page 2: CGPA (text) + Budget (capsules) + Intake (capsules)
  return (
    <div className="flex flex-col min-h-screen" style={{ background: C.bg }}>
      <FlowHeader onBack={() => setPage(0)} canGoBack label="About You" current={2} total={2} />
      <div className="flex-1 px-5 pt-6 pb-10">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}>

          <h2 className="font-extrabold mb-1 leading-tight"
            style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 'clamp(20px,5.5vw,26px)', color: C.text, letterSpacing: '-0.5px' }}>
            A few more details
          </h2>
          <p className="text-sm mb-6" style={{ color: C.textSub }}>Helps us personalise your salary & scholarship data</p>

          {/* CGPA — free text */}
          <TextField
            label="Undergraduate CGPA"
            id="cgpa"
            value={answers.cgpa}
            onChange={val => onUpdate('cgpa', val)}
            placeholder="e.g. 7.5"
            hint="Enter your CGPA on a 10-point scale"
          />

          {/* Budget — 4 capsules */}
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textMuted }}>
            Total budget (tuition + living)
          </p>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {budgetOptions.map(opt => (
              <OptionBtn key={opt.value} option={opt} selected={answers.budget}
                onClick={val => onUpdate('budget', val)} />
            ))}
          </div>

          {/* Intake — 3 capsules */}
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textMuted }}>
            Target intake
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {intakeOptions.map(opt => (
              <OptionBtn key={opt.value} option={opt} selected={answers.intake}
                onClick={val => onUpdate('intake', val)} />
            ))}
          </div>

          <ContinueBtn disabled={!p2Ready} onClick={onComplete} label="See My Report" />
        </motion.div>
      </div>
    </div>
  )
}

// ─── SCREEN 2: PAYMENT ────────────────────────────────────────────────────────
function PaymentScreen({ onPay }) {
  const [paying, setPaying] = useState(false)

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => { setPaying(false); onPay() }, 1600)
  }

  const perks = [
    { Icon: TrendingUp, text: 'Real salary data from 2,400+ alumni matching your profile', color: C.orange },
    { Icon: Award,      text: 'Top scholarships you personally qualify for', color: C.emerald },
    { Icon: Users,      text: 'Peer success stories with similar background', color: C.violet },
    { Icon: Target,     text: 'Personalised 30-day action plan to get started', color: C.coral },
  ]

  return (
    <div className="flex flex-col min-h-screen px-5 py-8" style={{ background: C.bg }}>
      {/* Leap badge */}
      <div className="flex justify-center mb-6">
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: '#FFF',
            color: C.orange,
            border: `1px solid ${C.orange}30`,
            boxShadow: `0 2px 12px ${C.orange}18`,
          }}
        >
          <FastForward size={12} /> Leap Fast Forward
        </span>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1
          className="text-center font-black mb-2"
          style={{
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 'clamp(24px,5.5vw,34px)',
            color: C.text,
            lineHeight: 1.15,
            letterSpacing: '-1px',
          }}
        >
          Your report is ready
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${C.orange}, ${C.coral})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            to generate
          </span>
        </h1>
        <p className="text-center text-sm mb-7" style={{ color: C.textSub }}>
          Unlock your personalised study-abroad ROI report
        </p>

        {/* Perks */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            background: C.card,
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: C.textMuted }}
          >
            What you get
          </p>
          <div className="space-y-3.5">
            {perks.map(({ Icon, text, color }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${color}12` }}
                >
                  <Icon size={15} style={{ color }} />
                </div>
                <p className="text-sm leading-snug" style={{ color: C.textSub }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            background: `linear-gradient(135deg, ${C.orange}08, ${C.coral}05)`,
            border: `1px solid ${C.orange}22`,
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs mb-1" style={{ color: C.textMuted }}>One-time unlock</p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="font-black"
                  style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 38, color: C.text, lineHeight: 1 }}
                >
                  ₹49
                </span>
                <span className="text-base line-through" style={{ color: C.textMuted }}>₹499</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: `${C.emerald}12`, color: C.emerald }}
                >
                  90% off
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-0.5 justify-end mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill={C.amber} style={{ color: C.amber }} />
                ))}
              </div>
              <p className="text-xs" style={{ color: C.textMuted }}>10,000+ students</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: paying ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePay}
            disabled={paying}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base text-white cursor-pointer"
            style={{
              background: paying ? 'rgba(0,0,0,0.15)' : `linear-gradient(135deg, ${C.orange}, ${C.coral})`,
              border: 'none',
              boxShadow: paying ? 'none' : `0 6px 24px ${C.orange}40`,
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 16,
            }}
          >
            {paying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                />
                Processing…
              </>
            ) : (
              <>
                <Lock size={15} />
                Pay ₹49 &amp; Generate My Report
                <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-5 flex-wrap">
          {[
            { Icon: Shield, text: '100% secure' },
            { Icon: Zap,    text: 'Instant delivery' },
            { Icon: Clock,  text: 'Ready in 10 sec' },
          ].map(({ Icon, text }, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Icon size={12} style={{ color: C.textMuted }} />
              <span className="text-xs" style={{ color: C.textMuted }}>{text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ─── SCREEN 3: POST-PAYMENT FLOW ──────────────────────────────────────────────
// 3 fixed steps: 0 = education, 1 = work experience, 2 = english test (MCQ)
function PostPaymentFlow({ answers, onUpdate, onComplete }) {
  const [step, setStep] = useState(-1) // -1 = intro splash
  const advancing = useRef(false)

  const handleMCQAnswer = (id, val) => {
    if (advancing.current) return
    advancing.current = true
    onUpdate(id, val)
    setTimeout(() => {
      advancing.current = false
      // step 2 = english test (last), auto-advance to report
      onComplete()
    }, 300)
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
    else setStep(-1)
  }

  // ── Intro splash ──
  if (step === -1) {
    return (
      <div
        className="flex flex-col min-h-screen items-center justify-center px-6 py-10 text-center"
        style={{ background: C.bg }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Success icon */}
          <div
            className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${C.orange}15, ${C.coral}10)`,
              border: `1.5px solid ${C.orange}22`,
              boxShadow: `0 8px 32px ${C.orange}18`,
            }}
          >
            <FastForward size={40} style={{ color: C.orange }} />
          </div>

          {/* Payment success pill */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4"
            style={{
              background: `${C.emerald}12`,
              border: `1px solid ${C.emerald}25`,
            }}
          >
            <Check size={13} strokeWidth={3} style={{ color: C.emerald }} />
            <span className="text-xs font-bold" style={{ color: C.emerald }}>
              Payment successful · ₹49
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="font-black mb-3"
            style={{
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 'clamp(22px,6vw,30px)',
              color: C.text,
              letterSpacing: '-0.5px',
            }}
          >
            You're almost there! 🎯
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm mb-8 max-w-xs mx-auto"
            style={{ color: C.textSub, lineHeight: 1.6 }}
          >
            A few quick questions so we can tailor your report precisely to your profile and goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 text-xs mb-8"
            style={{ color: C.textMuted }}
          >
            <span>📋 3 quick questions</span>
            <span>·</span>
            <span>⏱ ~1 minute</span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep(0)}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${C.orange}, ${C.coral})`,
              border: 'none',
              boxShadow: `0 6px 28px ${C.orange}38`,
              fontFamily: 'Plus Jakarta Sans',
            }}
          >
            Let's Go <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Step 0 – Education: degree + specialization (both on same page)
  if (step === 0) {
    const eduReady = answers.education && answers.specialization
    return (
      <div className="flex flex-col min-h-screen" style={{ background: C.bg }}>
        <FlowHeader onBack={handleBack} canGoBack label="Your Profile" current={1} total={3} />
        <div className="flex-1 px-5 pt-6 pb-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}>
            <h2 className="font-extrabold mb-1 leading-tight"
              style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 'clamp(20px,5.5vw,26px)', color: C.text, letterSpacing: '-0.5px' }}>
              Tell us about your education
            </h2>
            <p className="text-sm mb-6" style={{ color: C.textSub }}>Your undergraduate degree and field of study</p>
            <SelectField label="Highest Degree" id="education" value={answers.education}
              onChange={val => onUpdate('education', val)} options={educationOptions}
              placeholder="Select your degree" />
            <SelectField label="Specialization / Branch" id="specialization" value={answers.specialization}
              onChange={val => onUpdate('specialization', val)} options={specializationOptions}
              placeholder="Select your specialization" />
            <ContinueBtn disabled={!eduReady} onClick={() => setStep(1)} />
          </motion.div>
        </div>
      </div>
    )
  }

  // Step 1 – Work Experience: job role + no-experience checkbox
  if (step === 1) {
    const noExp = answers.noExperience === true
    const workReady = noExp || !!answers.jobRole
    return (
      <div className="flex flex-col min-h-screen" style={{ background: C.bg }}>
        <FlowHeader onBack={handleBack} canGoBack label="Your Profile" current={2} total={3} />
        <div className="flex-1 px-5 pt-6 pb-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}>
            <h2 className="font-extrabold mb-1 leading-tight"
              style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 'clamp(20px,5.5vw,26px)', color: C.text, letterSpacing: '-0.5px' }}>
              What's your current job role?
            </h2>
            <p className="text-sm mb-6" style={{ color: C.textSub }}>Select the role closest to your current position</p>

            {/* Job role dropdown — disabled when no-exp checked */}
            <div style={{ opacity: noExp ? 0.4 : 1, pointerEvents: noExp ? 'none' : 'auto',
              transition: 'opacity 0.2s ease' }}>
              <SelectField label="Job Role" id="jobRole" value={answers.jobRole}
                onChange={val => onUpdate('jobRole', val)} options={jobRoleOptions}
                placeholder="Select your job role" />
            </div>

            {/* No experience checkbox */}
            <motion.label
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 mt-2 cursor-pointer select-none rounded-2xl px-4 py-3.5"
              style={{
                background: noExp ? `${C.orange}10` : 'rgba(0,0,0,0.03)',
                border: `1.5px solid ${noExp ? C.orange : 'rgba(0,0,0,0.08)'}`,
                transition: 'all 0.18s ease',
              }}
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: noExp ? C.orange : '#fff',
                  border: `2px solid ${noExp ? C.orange : 'rgba(0,0,0,0.18)'}`,
                  transition: 'all 0.18s ease',
                }}
              >
                {noExp && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
              <span className="text-sm font-semibold" style={{ color: noExp ? C.orangeDark : C.textSub }}>
                I have no work experience
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={noExp}
                onChange={e => {
                  onUpdate('noExperience', e.target.checked)
                  if (e.target.checked) onUpdate('jobRole', '')
                }}
              />
            </motion.label>

            <ContinueBtn disabled={!workReady} onClick={() => setStep(2)} />
          </motion.div>
        </div>
      </div>
    )
  }

  // Step 2 – English Test (MCQ, auto-advance)
  const englishQ = {
    id: 'englishTest',
    question: 'Have you taken an English proficiency test?',
    subtitle: 'IELTS, TOEFL, PTE, Duolingo, or similar',
    options: englishTestOptions,
  }
  return (
    <QuestionScreen
      q={englishQ}
      answers={answers}
      onAnswer={handleMCQAnswer}
      onBack={handleBack}
      canGoBack
      label="Your Profile"
      current={3}
      total={3}
    />
  )
}

// ─── SCREEN 4: LOADER (10 seconds) ────────────────────────────────────────────
function LoaderScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [msgIdx, setMsgIdx]     = useState(0)
  const DURATION = 10000

  const done = useCallback(onDone, []) // stable ref

  useEffect(() => {
    const start = Date.now()
    const tick = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      setMsgIdx(
        Math.min(
          Math.floor((elapsed / DURATION) * loaderMessages.length),
          loaderMessages.length - 1
        )
      )
      if (pct >= 100) {
        clearInterval(tick)
        setTimeout(done, 500)
      }
    }, 60)
    return () => clearInterval(tick)
  }, [done])

  const r = 48, cx = 60, cy = 60
  const circ = 2 * Math.PI * r // ≈ 301.6

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center px-6 text-center"
      style={{ background: C.bg }}
    >
      {/* Ring */}
      <div className="relative mb-8">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="lgLoader" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={C.orange} />
              <stop offset="100%" stopColor={C.coral} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r}
            fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="9" />
          {/* Fill – no framer-motion needed, just a style transition */}
          <circle cx={cx} cy={cy} r={r}
            fill="none"
            stroke="url(#lgLoader)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (circ * progress) / 100}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.12s linear' }}
          />
        </svg>
        {/* Centre icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FastForward size={30} style={{ color: C.orange }} />
          </motion.div>
        </div>
      </div>

      <h2
        className="font-black mb-3"
        style={{
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 'clamp(20px,5vw,26px)',
          color: C.text,
        }}
      >
        Building Your Report…
      </h2>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-sm mb-10"
          style={{ color: C.textSub, minHeight: 22 }}
        >
          {loaderMessages[msgIdx]}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-2 rounded-full mb-2" style={{ background: 'rgba(0,0,0,0.07)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${C.orange}, ${C.coral})`,
            transition: 'width 0.12s linear',
          }}
        />
      </div>
      <p className="text-xs tabular-nums" style={{ color: C.textMuted }}>
        {Math.round(progress)}% complete
      </p>
    </div>
  )
}

// ─── ROOT FLOW APP ─────────────────────────────────────────────────────────────
export default function FlowApp() {
  const [screen, setScreen] = useState('onboarding')
  // 'onboarding' | 'payment' | 'post_payment' | 'loading' | 'report'
  const [answers, setAnswers] = useState({})

  const updateAnswer = useCallback((id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }, [])

  // DEV shortcut — expose screen setter on window for quick preview testing
  useEffect(() => {
    if (import.meta.env.DEV) window.__setScreen = setScreen
    return () => { if (import.meta.env.DEV) delete window.__setScreen }
  }, [setScreen])

  const slide = {
    enter:  { opacity: 0, y: 18 },
    center: { opacity: 1, y: 0 },
    exit:   { opacity: 0, y: -12 },
  }
  const fade = {
    enter:  { opacity: 0 },
    center: { opacity: 1 },
    exit:   { opacity: 0 },
  }
  const tr = { duration: 0.32, ease: [0.22, 1, 0.36, 1] }

  return (
    <div style={{ overflow: 'hidden' }}>
    <AnimatePresence mode="wait">
      {screen === 'onboarding' && (
        <motion.div key="onboarding"
          variants={slide} initial="enter" animate="center" exit="exit"
          transition={tr} style={{ minHeight: '100vh', width: '100%' }}>
          <OnboardingFlow
            answers={answers}
            onUpdate={updateAnswer}
            onComplete={() => setScreen('payment')}
          />
        </motion.div>
      )}

      {screen === 'payment' && (
        <motion.div key="payment"
          variants={slide} initial="enter" animate="center" exit="exit"
          transition={tr} style={{ minHeight: '100vh', width: '100%' }}>
          <PaymentScreen onPay={() => setScreen('post_payment')} />
        </motion.div>
      )}

      {screen === 'post_payment' && (
        <motion.div key="post_payment"
          variants={slide} initial="enter" animate="center" exit="exit"
          transition={tr} style={{ minHeight: '100vh', width: '100%' }}>
          <PostPaymentFlow
            answers={answers}
            onUpdate={updateAnswer}
            onComplete={() => setScreen('loading')}
          />
        </motion.div>
      )}

      {screen === 'loading' && (
        <motion.div key="loading"
          variants={fade} initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.4 }} style={{ minHeight: '100vh', width: '100%' }}>
          <LoaderScreen onDone={() => setScreen('report')} />
        </motion.div>
      )}

      {screen === 'report' && (
        <motion.div key="report"
          variants={fade} initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.55 }} style={{ width: '100%' }}>
          <Report />
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}
