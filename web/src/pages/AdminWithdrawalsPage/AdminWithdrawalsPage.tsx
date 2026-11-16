import { useEffect, useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { db } from 'src/lib/firebase'
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  increment,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { ArrowLeft, Banknote, CheckCircle2, XCircle, Clock, Mail, Loader2 } from 'lucide-react'

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
}

const AdminWithdrawalsPage = () => {
  const [requests, setRequests] = useState<any[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'withdrawals'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      setRequests(
        data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      )
    })
    return () => unsub()
  }, [])

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No Date'
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp)
    return date.toLocaleString()
  }

  const markPaid = async (req: any) => {
    setBusyId(req.id)
    try {
      await updateDoc(doc(db, 'withdrawals', req.id), {
        status: 'paid',
        paidAt: new Date().toISOString(),
      })
    } catch (e: any) {
      alert('Failed to update: ' + (e?.message || 'unknown error'))
    } finally {
      setBusyId(null)
    }
  }

  const rejectAndRefund = async (req: any) => {
    if (!confirm(`Reject this request and refund ${Number(req.amount).toLocaleString()} to the user?`)) return
    setBusyId(req.id)
    try {
      await updateDoc(doc(db, 'withdrawals', req.id), {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
      })

      if (req.userId) {
        await setDoc(
          doc(db, 'profiles', req.userId),
          { walletBalance: increment(Number(req.amount) || 0) },
          { merge: true }
        )
        await addDoc(collection(db, 'transactions'), {
          userId: req.userId,
          userEmail: req.userEmail || '',
          type: 'credit',
          amount: Number(req.amount) || 0,
          description: 'Withdrawal refunded',
          createdAt: serverTimestamp(),
        })
      }
    } catch (e: any) {
      alert('Failed to refund: ' + (e?.message || 'unknown error'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-screen bg-red-50">
      <Metadata title="Admin Withdrawals" />
      <header className="bg-red-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(routes.admin())} className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-bold hover:bg-white/30">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h1 className="flex items-center gap-2 text-2xl font-black">
              <Banknote className="h-6 w-6" /> Withdrawals
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl border border-red-100 bg-white p-6">
          {requests.length === 0 ? (
            <p className="py-8 text-center text-gray-400">No withdrawal requests yet...</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => {
                const status = req.status || 'pending'
                return (
                  <div key={req.id} className="rounded-xl border border-red-200 p-4">
                    <div className="mb-3 flex flex-col justify-between gap-2 border-b border-red-100 pb-3 md:flex-row">
                      <p className="flex items-center gap-2 text-base font-bold text-gray-800">
                        <Mail className="h-5 w-5 text-red-600" /> {req.userEmail || 'Unknown Email'}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-4 w-4" /> {formatDate(req.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="flex-1">
                        <p className="mb-1 text-xs font-bold text-red-600">Amount</p>
                        <p className="text-lg font-black text-gray-800">
                          {Number(req.amount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs font-bold text-red-600">Bank</p>
                        <p className="text-sm text-gray-700">{req.bankName || '—'}</p>
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs font-bold text-red-600">Account Number</p>
                        <p className="text-sm font-semibold text-gray-700">{req.accountNumber || '—'}</p>
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs font-bold text-red-600">Account Name</p>
                        <p className="text-sm text-gray-700">{req.accountName || '—'}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-red-100 pt-3">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusStyles[status] || statusStyles.pending}`}>
                        {status}
                      </span>

                      {status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => markPaid(req)}
                            disabled={busyId === req.id}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {busyId === req.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            Mark Paid
                          </button>
                          <button
                            onClick={() => rejectAndRefund(req)}
                            disabled={busyId === req.id}
                            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject & Refund
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminWithdrawalsPage
