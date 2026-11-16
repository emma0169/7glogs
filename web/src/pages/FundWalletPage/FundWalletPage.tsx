import { useEffect, useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { ChevronLeft, Loader2, CreditCard } from 'lucide-react'
import { useAuth } from 'src/contexts/AuthContexts'
import { db } from 'src/lib/firebase'
import { doc, getDoc, setDoc, increment, collection, addDoc, runTransaction, serverTimestamp } from 'firebase/firestore'

declare global {
  interface Window {
    PaystackPop: any
  }
}

const PAYSTACK_PUBLIC_KEY = 'pk_live_1868667df0704f583055b189f21c85769a6ddebd'
const REFERRAL_REWARD = 3000

const loadPaystack = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('No window'))
    if (window.PaystackPop) return resolve(window.PaystackPop)

    const existing = document.querySelector('script[src*="paystack"]') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(window.PaystackPop))
      existing.addEventListener('error', () => reject(new Error('Paystack script failed')))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve(window.PaystackPop)
    script.onerror = () => reject(new Error('Paystack script failed to load'))
    document.body.appendChild(script)
  })
}

const FundWalletPage = () => {
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [isPaying, setIsPaying] = useState(false)

  const quickAmounts = ['1000', '2000', '5000', '10000', '20000', '50000']

  useEffect(() => {
    loadPaystack().catch((err) => console.error('Paystack load error:', err))
  }, [])

  const handleFund = async () => {
    const amt = parseInt(amount, 10)
    if (!amt || amt < 100) {
      alert('Please enter a valid amount (minimum 100)')
      return
    }
    if (!user?.email) {
      alert('Please log in first')
      return
    }
    if (!user?.uid) {
      alert('User not loaded yet, please try again')
      return
    }

    setIsPaying(true)

    const reference = `WZ-${Date.now()}-${Math.floor(Math.random() * 100000)}`

    const onSuccess = async (response: any) => {
      try {
        const docRef = doc(db, 'profiles', user.uid)
        await setDoc(
          docRef,
          {
            walletBalance: increment(amt),
            lastFundedAt: new Date().toISOString(),
            hasDeposited: true,
          },
          { merge: true }
        )

        try {
          await addDoc(collection(db, 'transactions'), {
            userId: user.uid,
            userEmail: user.email || '',
            type: 'credit',
            amount: amt,
            description: 'Wallet top-up',
            reference: response?.reference || reference,
            createdAt: serverTimestamp(),
          })
        } catch (txErr) {
          console.warn('Transaction log failed (non-critical):', txErr)
        }

        // Credit the referrer once, on the referred user's first deposit
        try {
          await runTransaction(db, async (tx) => {
            const referredSnap = await tx.get(docRef)
            const referred = referredSnap.data()
            if (
              !referred?.referredBy ||
              referred?.referralRewarded ||
              referred.referredBy === user.uid
            ) {
              return
            }

            const referrerRef = doc(db, 'profiles', referred.referredBy)
            tx.set(
              referrerRef,
              {
                walletBalance: increment(REFERRAL_REWARD),
                referralEarnings: increment(REFERRAL_REWARD),
                referralCount: increment(1),
              },
              { merge: true }
            )
            tx.set(docRef, { referralRewarded: true }, { merge: true })
            tx.set(doc(collection(db, 'transactions')), {
              userId: referred.referredBy,
              type: 'credit',
              amount: REFERRAL_REWARD,
              description: 'Referral bonus',
              reference: `REF-${user.uid}`,
              createdAt: serverTimestamp(),
            })
          })
        } catch (refErr) {
          console.warn('Referral reward failed (non-critical):', refErr)
        }

        alert(`Wallet funded with ${amt.toLocaleString()}!`)
        navigate(routes.home())
      } catch (err: any) {
        console.error('Wallet update failed:', err)
        alert('Payment succeeded but wallet update failed: ' + (err?.message || 'unknown error'))
      } finally {
        setIsPaying(false)
      }
    }

    try {
      const PaystackPop = await loadPaystack()

      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: amt * 100,
        currency: 'NGN',
        ref: reference,
        callback: (response: any) => {
          onSuccess(response)
        },
        onClose: () => setIsPaying(false),
      })

      handler.openIframe()
    } catch (err: any) {
      console.error('Paystack popup error:', err)
      alert('Could not open payment popup: ' + (err?.message || 'Unknown error'))
      setIsPaying(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F3F4F8] font-sans text-[#211F26] pb-32">
      <Metadata title="Fund Wallet" />

      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-[#E9E5EE] bg-white p-4">
        <button onClick={() => navigate(routes.home())} className="rounded-full p-1 hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-[#211F26]" />
        </button>
        <h1 className="text-lg font-bold">Fund Wallet</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="rounded-2xl border border-[#E9E5EE] bg-white p-6">
          <p className="mb-4 text-sm text-[#6F6B76]">Add money to your FlyHub wallet to buy social media accounts instantly.</p>

          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-2">Amount</label>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${amount === val ? 'border-[#4338CA] bg-[#4338CA]/10 text-[#4338CA]' : 'border-[#E9E5EE] bg-white text-[#6F6B76]'}`}
                >
                  {val}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-3 rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] px-4 py-3 text-sm font-semibold text-[#211F26] outline-none focus:border-[#312E81]"
            />
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#6F6B76]">Amount to fund</span>
            <span className="font-bold">{amount ? parseInt(amount, 10).toLocaleString() : '0'}</span>
          </div>

          <button
            onClick={handleFund}
            disabled={isPaying || !amount}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold transition disabled:opacity-50 ${
              amount ? 'bg-[#4338CA] text-white hover:bg-[#3730A3]' : 'bg-[#E9E5EE] text-[#A09BA8]'
            }`}
          >
            {isPaying ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" /> Fund with {parseInt(amount || '0', 10).toLocaleString()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FundWalletPage
