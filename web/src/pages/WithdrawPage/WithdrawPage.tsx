import { useEffect, useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { ChevronLeft, Loader2, Wallet, Banknote } from 'lucide-react'
import { useAuth } from 'src/contexts/AuthContexts'
import { db } from 'src/lib/firebase'
import { doc, getDoc, setDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const BANKS = [
  'Access Bank',
  'Citibank',
  'Ecobank',
  'Fidelity Bank',
  'First Bank',
  'FCMB',
  'GTBank',
  'Kuda',
  'Moniepoint',
  'Opay',
  'Palmpay',
  'Polaris Bank',
  'Stanbic IBTC',
  'Sterling Bank',
  'UBA',
  'Union Bank',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
  'Other',
]

const WithdrawPage = () => {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'profiles', user.uid))
        if (snap.exists()) setBalance(Number(snap.data()?.walletBalance) || 0)
      } catch (e) {
        console.error('Failed to load wallet:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleWithdraw = async () => {
    if (!user?.uid || !user?.email) {
      alert('Please log in to withdraw.')
      return
    }
    const amt = parseInt(amount, 10)
    if (!amt || amt < 500) {
      alert('Enter a valid amount (minimum 500).')
      return
    }
    if (amt > balance) {
      alert('Insufficient balance.')
      return
    }
    if (!bankName) {
      alert('Please select your bank.')
      return
    }
    if (!/^\d{10}$/.test(accountNumber)) {
      alert('Enter a valid 10-digit account number.')
      return
    }
    if (!accountName.trim()) {
      alert('Please enter the account name.')
      return
    }

    setSubmitting(true)
    try {
      await setDoc(
        doc(db, 'profiles', user.uid),
        { walletBalance: increment(-amt) },
        { merge: true }
      )

      await addDoc(collection(db, 'withdrawals'), {
        userId: user.uid,
        userEmail: user.email,
        amount: amt,
        bankName,
        accountNumber,
        accountName: accountName.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      })

      try {
        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          userEmail: user.email,
          type: 'debit',
          amount: amt,
          description: 'Withdrawal request',
          createdAt: serverTimestamp(),
        })
      } catch (txErr) {
        console.warn('Transaction log failed (non-critical):', txErr)
      }

      alert('Withdrawal request submitted! We will process it shortly.')
      navigate(routes.profile())
    } catch (err: any) {
      console.error('Withdrawal failed:', err)
      alert('Withdrawal failed: ' + (err?.message || 'unknown error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F3F4F8] font-sans text-[#211F26] pb-32">
      <Metadata title="Withdraw" />

      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-[#E9E5EE] bg-white p-4">
        <button onClick={() => navigate(routes.profile())} className="rounded-full p-1 hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-[#211F26]" />
        </button>
        <h1 className="text-lg font-bold">Withdraw</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#312E81] to-[#4338CA] p-5 text-white">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
            <Wallet className="h-3.5 w-3.5" /> Balance
          </p>
          <p className="mt-1 text-3xl font-black">
            {loading ? '...' : balance.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E9E5EE] bg-white p-5 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6F6B76]">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] px-4 py-3 text-sm font-semibold text-[#211F26] outline-none focus:border-[#312E81]"
            />
            <button
              onClick={() => setAmount(String(balance))}
              className="mt-2 text-xs font-bold text-[#4338CA] hover:underline"
            >
              Max ({balance.toLocaleString()})
            </button>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6F6B76]">Bank</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] px-4 py-3 text-sm font-semibold text-[#211F26] outline-none focus:border-[#312E81]"
            >
              <option value="">Select bank</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6F6B76]">Account No.</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] px-4 py-3 text-sm font-semibold text-[#211F26] outline-none focus:border-[#312E81]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6F6B76]">Account name</label>
            <input
              type="text"
              placeholder="Name on account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] px-4 py-3 text-sm font-semibold text-[#211F26] outline-none focus:border-[#312E81]"
            />
          </div>

          <button
            onClick={handleWithdraw}
            disabled={submitting || loading || balance < 500}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] py-4 text-base font-black text-white transition hover:bg-[#3730A3] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Banknote className="h-5 w-5" />}
            {submitting ? 'Processing...' : 'Withdraw'}
          </button>

          {!loading && balance < 500 && (
            <p className="text-center text-xs text-[#6F6B76]">Minimum withdrawal is 500.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WithdrawPage
