import { useState, useEffect } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { useAuth } from 'src/contexts/AuthContexts'
import { X, ShoppingBag, Zap, ShieldCheck } from 'lucide-react'

const SLIDES = [
  {
    icon: ShoppingBag,
    title: 'Buy Social Media Accounts',
    subtitle: 'TikTok, Instagram, Facebook, X & WhatsApp accounts ready to use',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    subtitle: 'Get the account login details right after payment',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Wallet',
    subtitle: 'Fund your wallet and pay safely with Paystack',
  },
]

const WelcomePage = () => {
  const { googleSignIn } = useAuth()
  const [current, setCurrent] = useState(0)
  const [sheetOpen, setSheetOpen] = useState<null | 'signup' | 'login'>(null)

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  let touchStartX = 0
  const handleTouchStart = (e: any) => {
    touchStartX = e.touches[0].clientX
  }
  const handleTouchEnd = (e: any) => {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrent((prev) => (prev + 1) % SLIDES.length)
      } else {
        setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
      }
    }
  }

  const slide = SLIDES[current]
  const SlideIcon = slide.icon

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#312E81]">
      <div className="relative flex h-full w-full max-w-md flex-col items-center justify-center overflow-hidden bg-[#312E81] px-6 text-center">
        {/* Slide area */}
        <div
          className="relative z-10 flex w-full max-w-sm flex-col items-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex h-56 w-full items-center justify-center">
            <div
              key={current}
              className="anim-pop-in flex h-44 w-44 items-center justify-center rounded-[2rem] border border-[#A5B4FC]/30 bg-[#A5B4FC]/10 shadow-2xl"
            >
              <SlideIcon className="h-20 w-20 text-[#A5B4FC]" strokeWidth={1.5} />
            </div>
          </div>

          <div key={`text-${current}`} className="anim-fade-up mt-4 h-24 w-full">
            <h2 className="text-2xl font-black tracking-tight text-[#A5B4FC] drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-sm font-light text-white/80">
              {slide.subtitle}
            </p>
          </div>

          {/* Dots */}
          <div className="mt-2 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'h-2 w-7 bg-[#A5B4FC]' : 'h-2 w-2 bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Brand */}
          <h1 className="mt-6 text-5xl font-black tracking-tight drop-shadow-lg">
            <span className="text-[#A5B4FC]">STR</span>
            <span className="text-white">EAM</span>
          </h1>

          <p className="mt-1 text-xs font-light uppercase tracking-widest text-white/60">
            Digital Accounts Marketplace
          </p>

          <div className="mt-7 flex w-full gap-3">
            <button
              onClick={() => setSheetOpen('login')}
              className="flex-1 rounded-full border-2 border-white/50 bg-transparent py-3.5 text-base font-bold text-white transition active:scale-95"
            >
              Log In
            </button>
            <button
              onClick={() => setSheetOpen('signup')}
              className="flex-1 rounded-full bg-[#A5B4FC] py-3.5 text-base font-bold text-[#312E81] transition active:scale-95"
            >
              Sign Up
            </button>
          </div>

          <p className="mt-5 text-[10px] tracking-wider text-white/40">
            Powered by FlyHub{' '}
            <button
              onClick={() => navigate(routes.adminLogin())}
              className="text-white/40 hover:text-white/70"
            >
              2026
            </button>
          </p>
        </div>

        {/* Bottom sheet */}
        {sheetOpen && (
          <div
            className="anim-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/60"
            onClick={() => setSheetOpen(null)}
          >
            <div
              className="anim-slide-up w-full max-w-md rounded-t-3xl bg-white p-6 pb-8 shadow-2xl"
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WelcomePage
