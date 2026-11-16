import { useEffect, useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { ChevronLeft, Loader2, ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react'
import { db } from 'src/lib/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useAuth } from 'src/contexts/AuthContexts'

type Tx = {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  createdAt: any
}

const toMillis = (ts: any): number => {
  if (!ts) return 0
  if (typeof ts === 'object' && typeof ts.seconds === 'number') return ts.seconds * 1000
  if (ts.toDate) return ts.toDate().getTime()
  const d = new Date(ts)
  return isNaN(d.getTime()) ? 0 : d.getTime()
}

const formatDate = (ts: any): string => {
  const ms = toMillis(ts)
  if (!ms) return '—'
  return new Date(ms).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const TransactionHistoryPage = () => {
  const { user, loading, isAuthenticated } = useAuth()
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user?.uid || !user?.email) {
      setFetching(false)
      return
    }

    let credits: Tx[] = []
    let debits: Tx[] = []

    const refresh = () => {
      setTransactions(
        [...credits, ...debits].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
      )
    }

    const unsubCredits = onSnapshot(
      query(collection(db, 'transactions'), where('userId', '==', user.uid)),
      (snap) => {
        credits = snap.docs.map((d) => {
          const data = d.data() as any
          return {
            id: d.id,
            type: data.type === 'debit' ? 'debit' : 'credit',
            amount: Number(data.amount) || 0,
            description: data.description || (data.type === 'debit' ? 'Payment' : 'Wallet top-up'),
            createdAt: data.createdAt,
          }
        })
        refresh()
        setFetching(false)
      },
      (err) => {
        console.warn('Transactions listener failed:', err)
        refresh()
        setFetching(false)
      }
    )

    const unsubDebits = onSnapshot(
      query(collection(db, 'orders'), where('customerEmail', '==', user.email)),
      (snap) => {
        debits = snap.docs.map((d) => {
          const data = d.data() as any
          return {
            id: d.id,
            type: 'debit',
            amount: Number(data.total ?? data.subtotal) || 0,
            description:
              data.items && data.items.length
                ? `Purchase: ${data.items.map((i: any) => i.name).join(', ')}`
                : 'Account purchase',
            createdAt: data.createdAt,
          }
        })
        refresh()
        setFetching(false)
      },
      (err) => {
        console.warn('Orders listener failed:', err)
        refresh()
        setFetching(false)
      }
    )

    return () => {
      unsubCredits()
      unsubDebits()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#4338CA]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F3F4F8] px-4 py-10">
        <Metadata title="Transaction History" />
        <div className="mx-auto max-w-md rounded-2xl border border-[#E9E5EE] bg-white p-8 text-center">
          <Receipt className="mx-auto h-10 w-10 text-[#4338CA]" />
          <h1 className="mt-3 text-lg font-extrabold text-[#211F26]">Please log in</h1>
          <p className="mt-1 text-sm text-[#6F6B76]">Log in to see your transactions.</p>
          <Link to={routes.home()} className="mt-5 inline-flex rounded-full bg-[#4338CA] px-6 py-2.5 text-sm font-bold text-white">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F3F4F8] font-sans text-[#211F26] pb-24">
      <Metadata title="Transaction History" description="Your wallet credits and purchases" />

      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-[#E9E5EE] bg-white p-4">
        <Link to={routes.profile()} className="rounded-full p-1 hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-[#211F26]" />
        </Link>
        <h1 className="text-lg font-bold">Transaction History</h1>
      </div>

      <div className="p-4">
        {fetching ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-[#4338CA]" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-8 text-center">
            <Receipt className="mx-auto h-10 w-10 text-[#A09BA8]" />
            <p className="mt-3 text-sm font-bold text-[#211F26]">No transactions yet</p>
            <p className="mt-1 text-xs text-[#6F6B76]">Your wallet top-ups and purchases will appear here.</p>
            <Link
              to={routes.home()}
              className="mt-5 inline-flex rounded-full bg-[#4338CA] px-6 py-2.5 text-sm font-bold text-white"
            >
              Browse Accounts
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const isCredit = tx.type === 'credit'
              return (
                <div key={tx.id} className="flex items-center gap-3 rounded-2xl border border-[#E9E5EE] bg-white p-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EEF0FF] text-[#4338CA]'
                    }`}
                  >
                    {isCredit ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#211F26]">{tx.description}</p>
                    <p className="text-[11px] text-[#6F6B76]">{formatDate(tx.createdAt)}</p>
                  </div>
                  <p className={`shrink-0 text-sm font-black ${isCredit ? 'text-emerald-600' : 'text-[#211F26]'}`}>
                    {isCredit ? '+' : '-'}
                    {tx.amount.toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistoryPage
