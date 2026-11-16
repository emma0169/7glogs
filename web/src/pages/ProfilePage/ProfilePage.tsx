// web/src/pages/ProfilePage/ProfilePage.tsx
import { useState, useEffect } from 'react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { User as UserIcon, Loader2, ChevronRight, Mail, HelpCircle, Wallet, LogOut, ShoppingBag, Receipt, Banknote } from 'lucide-react'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from 'src/lib/firebase'
import { useAuth } from 'src/contexts/AuthContexts'

const ISSUE_TYPES = ['Account issue', 'Payment problem', 'Wrong details received', 'Other']

const ProfilePage = () => {
  const { user, logOut, isAuthenticated, loading } = useAuth()
  const [walletBalance, setWalletBalance] = useState(0)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [issueType, setIssueType] = useState('')
  const [issueOther, setIssueOther] = useState('')
  const [supportPhone, setSupportPhone] = useState('')
  const [isSubmittingHelp, setIsSubmittingHelp] = useState(false)

  const getDisplayName = () => {
    if (!user) return 'Guest'
    if (user.displayName) return user.displayName
    if (user.email) return user.email.split('@')[0]
    return 'Guest'
  }

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      setIsLoadingProfile(true)
      try {
        const docRef = doc(db, 'profiles', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.walletBalance) setWalletBalance(data.walletBalance)
          if (data.phone) setSupportPhone(data.phone)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }
    loadProfile()
  }, [user])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logOut()
      navigate('/', { replace: true })
    } catch (e) {
      console.error('Logout failed', e)
      setIsLoggingOut(false)
    }
  }

  const handleHelpSubmit = async () => {
    if (!user) return
    if (!issueType) {
      alert('Please select what you need help with.')
      return
    }
    setIsSubmittingHelp(true)
    try {
      await addDoc(collection(db, 'help'), {
        userEmail: user.email || '',
        userPhone: supportPhone || '',
        issueType: issueType,
        issueOther: issueOther,
        createdAt: serverTimestamp(),
      })
      alert('Support request submitted! We will get back to you shortly.')
      setIsHelpOpen(false)
      setIssueType('')
      setIssueOther('')
    } catch (error: any) {
      console.error('Error submitting support request:', error)
      alert('Could not submit request: ' + (error?.message || 'unknown error'))
    } finally {
      setIsSubmittingHelp(false)
    }
  }

  if (loading || isLoadingProfile) {
    return <div className="min-h-screen bg-[#F3F4F8] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#4338CA]" /></div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F3F4F8] py-10">
        <Metadata title="Profile — Please login" description="Login to manage your profile" />
        <div className="container mx-auto max-w-md px-4">
          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF] text-[#4338CA]">
              <UserIcon className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-xl font-extrabold text-[#211F26]">You're not logged in</h1>
            <p className="mt-2 text-sm text-[#6F6B76]">Log in to manage your account.</p>
            <Link to={routes.home()} className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#4338CA] px-6 py-3 text-sm font-bold text-white hover:bg-[#1E1B4B] transition">Go to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3F4F8] font-sans pb-24">
      <Metadata title="My Profile" description="Manage your account" />

      <div className="relative border-b border-[#E9E5EE] bg-white px-6 pb-6 pt-8">
        <div className="anim-fade-up mx-auto flex max-w-3xl items-center gap-3">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="anim-pop-in h-14 w-14 rounded-full border border-[#E9E5EE] object-cover" />
          ) : (
            <div className="anim-pop-in flex h-14 w-14 items-center justify-center rounded-full bg-[#4338CA] text-xl font-black text-white">
              {getDisplayName()[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold text-[#211F26]">{getDisplayName()}</h2>
            <p className="flex items-center gap-1.5 text-sm font-medium text-[#6F6B76] truncate">
              <Mail className="h-4 w-4 text-[#A09BA8] shrink-0" /> {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-4">
        {/* Small wallet balance card */}
        <div className="anim-fade-up rounded-2xl bg-gradient-to-r from-[#312E81] to-[#4338CA] p-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Wallet Balance</p>
              <p className="text-2xl font-black">{walletBalance.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              to={routes.fundWallet()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#312E81] transition active:scale-95"
            >
              <Wallet className="h-3.5 w-3.5" /> Add Funds
            </Link>
            <Link
              to={routes.withdraw()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/20 px-3 py-2 text-xs font-bold text-white transition active:scale-95"
            >
              <Banknote className="h-3.5 w-3.5" /> Withdraw
            </Link>
          </div>
        </div>

        <div className="anim-fade-up rounded-2xl border border-[#E9E5EE] bg-white" style={{ animationDelay: '0.1s' }}>
          <div className="divide-y divide-[#E9E5EE]">
            <button onClick={() => navigate(routes.orders())} className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-gray-50 active:bg-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-[#6F6B76]" />
                <span className="text-base font-semibold text-[#211F26]">Order history</span>
              </div>
              <ChevronRight className="h-5 w-5 text-[#6F6B76]" />
            </button>

            <button onClick={() => navigate(routes.transactions())} className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-gray-50 active:bg-gray-100">
              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-[#6F6B76]" />
                <span className="text-base font-semibold text-[#211F26]">Transaction history</span>
              </div>
              <ChevronRight className="h-5 w-5 text-[#6F6B76]" />
            </button>

            {/* Contact Support */}
            <div>
              <button onClick={() => setIsHelpOpen(!isHelpOpen)} className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-gray-50 active:bg-gray-100">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-[#6F6B76]" />
                  <span className="text-base font-semibold text-[#211F26]">Contact Support</span>
                </div>
                <ChevronRight className={`h-5 w-5 text-[#6F6B76] transition-transform ${isHelpOpen ? 'rotate-90' : ''}`} />
              </button>

              {isHelpOpen && (
                <div className="space-y-4 border-t border-[#E9E5EE] bg-white p-4">
                  <p className="text-sm font-bold text-[#6F6B76]">What do you need help with?</p>
                  <div className="space-y-3">
                    {ISSUE_TYPES.map((option) => (
                      <label key={option} className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#211F26]">
                        <input
                          type="radio"
                          name="issueType"
                          value={option}
                          checked={issueType === option}
                          onChange={(e) => setIssueType(e.target.value)}
                          className="h-5 w-5 accent-[#4338CA]"
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  <input
                    type="tel"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    placeholder="Your phone number (optional)"
                    className="w-full rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] px-4 py-2 text-sm outline-none focus:border-[#4338CA]"
                  />

                  <textarea
                    value={issueOther}
                    onChange={(e) => setIssueOther(e.target.value)}
                    placeholder="Type more details..."
                    rows={3}
                    className="w-full rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] px-4 py-2 text-sm outline-none focus:border-[#4338CA]"
                  />

                  <button
                    onClick={handleHelpSubmit}
                    disabled={isSubmittingHelp}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#312E81] py-3 text-sm font-bold text-white hover:bg-[#1E1B4B] disabled:opacity-50"
                  >
                    {isSubmittingHelp ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {isSubmittingHelp ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleLogout} disabled={isLoggingOut} className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-gray-50 active:bg-gray-100">
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5 text-red-600" />
                <span className="text-base font-semibold text-red-600">Log Out</span>
              </div>
              {isLoggingOut ? <Loader2 className="h-5 w-5 animate-spin text-red-600" /> : <ChevronRight className="h-5 w-5 text-red-600" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
