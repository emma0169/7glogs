import { useEffect, useRef, useState, type ReactNode } from 'react'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import SocialIcon from 'src/components/SocialIcon/SocialIcon'
import { useAuth } from 'src/contexts/AuthContexts'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Headphones,
  Lock,
  Menu,
  Package,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react'

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Support', href: '#support' },
]

const STATS = [
  { end: 20000, suffix: '+', decimals: 0, label: 'Active Users' },
  { end: 5000000, suffix: '+', decimals: 0, label: 'Orders Delivered' },
  { end: 50, suffix: '+', decimals: 0, label: 'Countries Supported' },
  { end: 99.9, suffix: '%', decimals: 1, label: 'Uptime Guarantee' },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Delivery',
    text: 'Account login details and numbers are delivered right after payment — no waiting.',
  },
  {
    icon: Wallet,
    title: 'Secure Wallet',
    text: 'Fund your wallet with Paystack and pay for every order safely in one place.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Accounts',
    text: 'Carefully sourced social media accounts and numbers across major platforms.',
  },
  {
    icon: Globe,
    title: 'Global Numbers',
    text: 'Buy virtual numbers from Nigeria, USA and more for OTP and app signups.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    text: 'Real human support ready to help you before and after every purchase.',
  },
  {
    icon: Package,
    title: 'Easy Tracking',
    text: 'Every purchase is saved in your order history so you can revisit it anytime.',
  },
]

const USE_CASES = [
  {
    icon: ShoppingBag,
    title: 'Social Accounts',
    text: 'Buy ready-made TikTok, Instagram, Facebook, X and WhatsApp accounts.',
  },
  {
    icon: Smartphone,
    title: 'Virtual Numbers',
    text: 'Verify accounts on WhatsApp, Telegram and other apps that need a phone number.',
  },
  {
    icon: Lock,
    title: 'OTP & Verification',
    text: 'Receive OTP and SMS verification codes without exposing your personal number.',
  },
  {
    icon: Wallet,
    title: 'Wallet Payments',
    text: 'Top up once and pay instantly for accounts and numbers from your balance.',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Presence',
    text: 'Start building your social presence on the platforms that matter to you.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    text: 'Stuck on an order? Reach our support team directly from your profile.',
  },
]

const REVIEWS = [
  {
    name: 'Sarah Johnson',
    role: 'Sales Director, TechStart Inc.',
    text: 'FlyHub is so easy to use. I bought a TikTok account and got the login details instantly. The wallet checkout is smooth and the dashboard is simple.',
  },
  {
    name: 'Michael Chen',
    role: 'Founder, GrowthLab',
    text: 'I needed an Instagram account fast for a campaign. Payment was quick, delivery was instant, and support answered me right away.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Manager, ScaleUp',
    text: 'The quality of the accounts is great and the prices are fair. I have ordered more than once and it has been consistent every time.',
  },
  {
    name: 'David Thompson',
    role: 'CEO, Digital Dynamics',
    text: 'Bought a USA number for verification and it worked on the first try. Fast and reliable — exactly what I needed.',
  },
  {
    name: 'Jessica Martinez',
    role: 'Freelance Consultant',
    text: 'As a creator I need accounts quickly. FlyHub delivers fast, and keeping everything in one wallet makes it effortless.',
  },
  {
    name: 'Robert Kim',
    role: 'Operations Lead, MobileFirst',
    text: 'The number selection is solid and the codes actually arrive. It has become part of our regular workflow.',
  },
]

const STEPS = [
  {
    icon: Users,
    title: 'Sign Up & Add Balance',
    text: 'Create an account and fund your FlyHub wallet securely with Paystack.',
  },
  {
    icon: ShoppingBag,
    title: 'Choose Your Account',
    text: 'Pick a platform, country and product — account or virtual number.',
  },
  {
    icon: Zap,
    title: 'Get Details Instantly',
    text: 'Pay from your wallet and receive the login details or number right away.',
  },
]

const FAQS = [
  {
    q: 'How fast do I get my account details after payment?',
    a: 'Instantly. As soon as your wallet payment is confirmed, the login details or virtual number are shown on screen and saved to your order history.',
  },
  {
    q: 'How do I fund my wallet?',
    a: 'Open your profile, tap Add Funds and pay with Paystack. Your balance is credited immediately and can be used for any product on FlyHub.',
  },
  {
    q: 'Are the accounts safe to use?',
    a: 'Accounts are carefully sourced and checked before listing. You receive the credentials directly, and you can change the password after your first login.',
  },
  {
    q: 'What if my account or number does not work?',
    a: 'Contact support from your profile with your order details. Our team reviews the issue and helps you resolve it as quickly as possible.',
  },
  {
    q: 'Which platforms do you support?',
    a: 'TikTok, Instagram, Facebook, X (Twitter), WhatsApp and virtual phone numbers for Nigeria, USA and more.',
  },
  {
    q: 'Do I need to download an app?',
    a: 'No. FlyHub works right in your browser on mobile and desktop, so you can buy and manage orders without installing anything.',
  },
]

const Reveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}

const CountUp = ({
  end,
  suffix = '',
  decimals = 0,
}: {
  end: number
  suffix?: string
  decimals?: number
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const duration = 1400
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(end * eased)
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [end])

  return (
    <span ref={ref}>
      {value.toLocaleString('en-US', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

const WelcomePage = () => {
  const { googleSignIn } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState<null | 'signup' | 'login'>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <>
      <Metadata
        title="FlyHub — Social Accounts & Numbers Marketplace"
        description="Buy social media accounts and virtual numbers instantly. Fast, reliable and easy to use."
      />

      <div className="min-h-screen scroll-smooth bg-[#F3F4F8] text-[#211F26]">
        {/* Nav */}
        <header className="sticky top-0 z-50 border-b border-[#E5E7F0] bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <a href="#top" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4338CA] to-[#312E81] text-lg font-black text-white shadow-lg shadow-[#4338CA]/30">
                F
              </span>
              <span className="text-lg font-black tracking-tight">
                <span className="text-[#4338CA]">Fly</span>
                <span className="text-[#211F26]">Hub</span>
              </span>
            </a>

            <nav className="hidden items-center gap-7 md:flex">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-semibold text-[#6F6B76] transition hover:text-[#4338CA]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => setSheetOpen('login')}
                className="rounded-full px-4 py-2 text-sm font-bold text-[#312E81] transition hover:bg-[#EEF0FF]"
              >
                Log In
              </button>
              <button
                onClick={() => setSheetOpen('signup')}
                className="rounded-full bg-[#4338CA] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4338CA]/30 transition hover:bg-[#3730A3] active:scale-95"
              >
                Sign Up
              </button>
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-lg p-2 text-[#312E81] md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-[#E5E7F0] bg-white px-4 py-4 md:hidden">
              <div className="flex flex-col gap-1">
                {NAV.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[#6F6B76] hover:bg-[#F3F4F8]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    setSheetOpen('login')
                  }}
                  className="flex-1 rounded-full border-2 border-[#4338CA]/20 py-2.5 text-sm font-bold text-[#312E81]"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    setSheetOpen('signup')
                  }}
                  className="flex-1 rounded-full bg-[#4338CA] py-2.5 text-sm font-bold text-white"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Hero */}
        <section id="top" className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#A5B4FC]/40 blur-3xl anim-float-slow" />
          <div className="pointer-events-none absolute -right-20 top-32 h-80 w-80 rounded-full bg-[#4338CA]/15 blur-3xl anim-float-slow" style={{ animationDelay: '1.5s' }} />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#C7D2FE]/40 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-[#4338CA]/15 bg-white/70 px-4 py-1.5 text-xs font-bold text-[#4338CA] shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Social accounts & virtual numbers
              </div>

              <h1 className="anim-fade-up mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl" style={{ animationDelay: '80ms' }}>
                Welcome to{' '}
                <span className="bg-gradient-to-r from-[#4338CA] via-[#312E81] to-[#6366F1] bg-clip-text text-transparent">
                  FlyHub Marketplace
                </span>
              </h1>

              <p className="anim-fade-up mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-[#6F6B76] sm:text-lg" style={{ animationDelay: '160ms' }}>
                A convenient marketplace for social media accounts and virtual
                numbers — fast, reliable, and easy to use.
              </p>

              <div className="anim-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '240ms' }}>
                <button
                  onClick={() => setSheetOpen('signup')}
                  className="anim-glow inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4338CA] px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-[#4338CA]/30 transition hover:bg-[#3730A3] active:scale-95 sm:w-auto"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#how"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#312E81]/15 bg-white/80 px-7 py-3.5 text-base font-bold text-[#312E81] backdrop-blur transition hover:border-[#4338CA]/40 hover:bg-white active:scale-95 sm:w-auto"
                >
                  How It Works
                </a>
              </div>

              <div className="anim-fade-up mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#8A8692]" style={{ animationDelay: '320ms' }}>
                {['TikTok', 'Instagram', 'Facebook', 'X (Twitter)', 'WhatsApp', 'Buy Number'].map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5">
                    <SocialIcon platform={p} size={14} /> {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Floating cards */}
            <div className="pointer-events-none absolute left-2 top-24 hidden lg:block">
              <div className="anim-float flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl shadow-[#312E81]/10 backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#4338CA]">
                  <Zap className="h-4 w-4" />
                </span>
                <div className="text-left">
                  <p className="text-xs font-black text-[#211F26]">Instant delivery</p>
                  <p className="text-[10px] font-semibold text-[#8A8692]">Right after payment</p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute right-2 top-40 hidden lg:block">
              <div className="anim-float flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl shadow-[#312E81]/10 backdrop-blur" style={{ animationDelay: '1.2s' }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Check className="h-4 w-4" />
                </span>
                <div className="text-left">
                  <p className="text-xs font-black text-[#211F26]">Payment secured</p>
                  <p className="text-[10px] font-semibold text-[#8A8692]">Powered by Paystack</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative z-10 mx-auto -mt-6 max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-[#E5E7F0] bg-white p-4 shadow-xl shadow-[#312E81]/5 sm:p-6 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90}>
                <div className="rounded-2xl px-3 py-4 text-center">
                  <p className="text-2xl font-black text-[#312E81] sm:text-3xl">
                    <CountUp end={stat.end} suffix={stat.suffix} decimals={stat.decimals} />
                  </p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#8A8692]">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4338CA]">
              The Features
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Why Choose FlyHub Marketplace
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-[#6F6B76] sm:text-base">
              Accounts, numbers and wallet payments — all in one simple
              dashboard built to save you time.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Reveal key={feature.title} delay={i * 80}>
                  <div className="group h-full rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#4338CA]/30 hover:shadow-xl hover:shadow-[#4338CA]/10">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#4338CA] transition group-hover:scale-110 group-hover:bg-[#4338CA] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-black">{feature.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-[#6F6B76]">
                      {feature.text}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Use cases */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4338CA]">
                Integration
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Use Cases & Integrations
              </h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#6F6B76] sm:text-base">
                From growing your socials to verifying new apps, FlyHub has a
                product for it.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {USE_CASES.map((useCase, i) => {
                const Icon = useCase.icon
                return (
                  <Reveal key={useCase.title} delay={i * 70}>
                    <div className="flex h-full gap-4 rounded-2xl border border-[#E5E7F0] bg-[#F9FAFF] p-5 transition duration-300 hover:border-[#4338CA]/30 hover:bg-white hover:shadow-lg">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#4338CA] shadow-sm">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-base font-black">{useCase.title}</h3>
                        <p className="mt-1 text-sm font-medium leading-relaxed text-[#6F6B76]">
                          {useCase.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4338CA]">
              Customer Reviews
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-[#6F6B76] sm:text-base">
              Join thousands of users who rely on FlyHub for accounts and
              numbers.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review, i) => (
              <Reveal key={review.name} delay={i * 70}>
                <div className="flex h-full flex-col rounded-2xl border border-[#E5E7F0] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex gap-0.5 text-amber-400">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-[#4A4650]">
                    “{review.text}”
                  </p>
                  <div className="mt-4 border-t border-[#EEF0F5] pt-3">
                    <p className="text-sm font-black">{review.name}</p>
                    <p className="text-xs font-semibold text-[#8A8692]">
                      {review.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="bg-[#312E81] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#A5B4FC]">
                How It Works
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                How FlyHub Marketplace Works
              </h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/70 sm:text-base">
                One account, one wallet — sign up, add balance and start buying
                in minutes.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <Reveal key={step.title} delay={i * 120}>
                    <div className="relative h-full rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur transition duration-300 hover:bg-white/15">
                      <span className="absolute -top-3 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#A5B4FC] text-sm font-black text-[#312E81]">
                        {i + 1}
                      </span>
                      <Icon className="h-7 w-7 text-[#A5B4FC]" />
                      <h3 className="mt-4 text-lg font-black">{step.title}</h3>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
                        {step.text}
                      </p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="support" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4338CA]">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              All You Need to Know
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-[#6F6B76] sm:text-base">
              Common questions about buying accounts and numbers on FlyHub.
            </p>
          </Reveal>

          <div className="mt-8 space-y-3">
            {FAQS.map((faq, i) => {
              const open = openFaq === i
              return (
                <Reveal key={faq.q} delay={i * 50}>
                  <div className="overflow-hidden rounded-2xl border border-[#E5E7F0] bg-white">
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-black text-[#211F26] sm:text-base">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#4338CA] transition-transform duration-300 ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm font-medium leading-relaxed text-[#6F6B76]">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4338CA] via-[#312E81] to-[#1E1B4B] px-6 py-12 text-center shadow-2xl shadow-[#312E81]/30 sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -right-6 h-48 w-48 rounded-full bg-[#A5B4FC]/20 blur-2xl" />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#A5B4FC]">
                Get started today
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                Buy Accounts & Numbers Anywhere
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-white/70 sm:text-base">
                Sign up, add balance and get instant access to accounts and
                virtual numbers from your phone or laptop.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => setSheetOpen('signup')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-black text-[#312E81] shadow-lg transition hover:bg-[#EEF0FF] active:scale-95 sm:w-auto"
                >
                  Get Started for Free <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#support"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-base font-bold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  Help & Support
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#E5E7F0] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4338CA] to-[#312E81] text-lg font-black text-white">
                    F
                  </span>
                  <span className="text-lg font-black tracking-tight">
                    <span className="text-[#4338CA]">Fly</span>
                    <span className="text-[#211F26]">Hub</span>
                  </span>
                </div>
                <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-[#6F6B76]">
                  FlyHub Marketplace helps you buy social media accounts and
                  virtual numbers instantly — safely and easily.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#211F26]">
                  Info
                </h3>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-[#6F6B76]">
                  <li><a href="#features" className="hover:text-[#4338CA]">Features</a></li>
                  <li><a href="#reviews" className="hover:text-[#4338CA]">Reviews</a></li>
                  <li><a href="#how" className="hover:text-[#4338CA]">How It Works</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#211F26]">
                  Company
                </h3>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-[#6F6B76]">
                  <li><a href="#top" className="hover:text-[#4338CA]">About Us</a></li>
                  <li><a href="#support" className="hover:text-[#4338CA]">Help Center</a></li>
                  <li><a href="#support" className="hover:text-[#4338CA]">Privacy Policy</a></li>
                  <li><a href="#support" className="hover:text-[#4338CA]">Terms & Conditions</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#211F26]">
                  Support
                </h3>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-[#6F6B76]">
                  <li><a href="#support" className="hover:text-[#4338CA]">FAQ</a></li>
                  <li><a href="#support" className="hover:text-[#4338CA]">Contact</a></li>
                  <li><a href="#features" className="hover:text-[#4338CA]">Buy Accounts</a></li>
                  <li><a href="#features" className="hover:text-[#4338CA]">Buy Numbers</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[#EEF0F5] pt-5 text-xs font-semibold text-[#8A8692] sm:flex-row">
              <p>© 2026 FlyHub Marketplace, Inc. All rights reserved.</p>
              <button
                onClick={() => navigate(routes.adminLogin())}
                className="text-[#8A8692] transition hover:text-[#4338CA]"
              >
                Thanks for joining!
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Auth sheet */}
      {sheetOpen && (
        <div
          className="anim-fade-in fixed inset-0 z-[60] flex items-end justify-center bg-black/60"
          onClick={() => setSheetOpen(null)}
        >
          <div
            className="anim-slide-up relative w-full max-w-md rounded-t-3xl bg-white p-6 pb-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-gray-300" />

            <button
              onClick={() => setSheetOpen(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mt-1 text-center text-2xl font-black text-[#211F26]">
              {sheetOpen === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-1 text-center text-sm text-[#6F6B76]">
              {sheetOpen === 'signup'
                ? 'Sign up in one tap to start buying accounts'
                : 'Log in to continue to your account'}
            </p>

            <button
              onClick={handleGoogleSignIn}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-full border-2 border-gray-200 bg-white py-3.5 text-base font-bold text-gray-800 transition hover:bg-gray-50 active:scale-95"
            >
              <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#A5B4FC" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              Continue with Google
            </button>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-[#8A8692]">
              By continuing you agree to FlyHub&apos;s Terms &amp; Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default WelcomePage
