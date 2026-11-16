import React, { useState, useEffect } from 'react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { useCart } from 'src/components/CartContext/CartContext'
import { ChevronLeft, Trash2, Wallet, Lock, CheckCircle2, Copy, X } from 'lucide-react'
import { useAuth } from 'src/contexts/AuthContexts'
import { db } from 'src/lib/firebase'
import { doc, getDoc, setDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const BasketPage = () => {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [walletBalance, setWalletBalance] = useState(0)
  const [isBuying, setIsBuying] = useState(false)
  const [purchased, setPurchased] = useState<any[] | null>(null)

  useEffect(() => {
    if (!user?.uid) return
    const loadBalance = async () => {
      const docRef = doc(db, 'profiles', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setWalletBalance(docSnap.data()?.walletBalance || 0)
      }
    }
    loadBalance()
  }, [user])

  const handleRemove = (id: string | number) => {
    removeFromCart(id)
  }

  const handleBuy = async () => {
    if (cart.length === 0 || isBuying) return
    if (!user?.uid || !user?.email) {
      alert('Please log in to complete your purchase.')
      return
    }
    if (walletBalance < totalPrice) {
      alert('Insufficient wallet balance. Please fund your wallet.')
      navigate(routes.fundWallet())
      return
    }

    setIsBuying(true)
    try {
      await setDoc(
        doc(db, 'profiles', user.uid),
        { walletBalance: increment(-totalPrice) },
        { merge: true }
      )

      await addDoc(collection(db, 'orders'), {
        customerName: user.displayName || user.email?.split('@')[0] || 'Customer',
        customerEmail: user.email || '',
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          category: i.category,
          code: i.code || '',
          accountEmail: i.accountEmail || '',
          accountPassword: i.accountPassword || '',
        })),
        subtotal: totalPrice,
        total: totalPrice,
        paid: true,
        isCompleted: true,
        paymentMethod: 'Wallet',
        paymentRef: `FlyHub-${Date.now()}`,
        createdAt: serverTimestamp(),
      })

      try {
        await addDoc(collection(db, 'notifications'), {
          title: 'Purchase Successful!',
          body: `You bought ${cart.length} account(s) for ${totalPrice.toLocaleString()}.`,
          targetEmail: user.email || '',
          createdAt: serverTimestamp(),
        })
      } catch (notifyErr) {
        console.warn('Notification failed (non-critical):', notifyErr)
      }

      setPurchased([...cart])
      setWalletBalance((b) => b - totalPrice)
      clearCart()
    } catch (e: any) {
      console.error('Purchase failed:', e)
      alert('Purchase failed: ' + (e?.message || 'unknown error'))
    } finally {
      setIsBuying(false)
    }
  }

  const copy = (text: string) => {
    if (!text) return
    navigator.clipboard?.writeText(text)
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F3F4F8] font-sans text-[#211F26] pb-40">
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-[#E9E5EE] bg-white p-4">
        <Link to={routes.home()} className="rounded-full p-1 hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-[#211F26]" />
        </Link>
        <h1 className="text-lg font-bold">Your Cart</h1>
      </div>

      <div className="p-4">
        {cart.length === 0 ? (
          <div className="anim-pop-in rounded-2xl bg-white p-8 text-center border border-[#E9E5EE]">
            <p className="text-sm text-[#6F6B76]">Your cart is empty.</p>
            <Link to={routes.home()} className="mt-4 inline-block rounded-full bg-[#4338CA] px-6 py-2 text-sm font-bold text-white transition hover:bg-[#3730A3] active:scale-95">Browse Accounts</Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="anim-fade-up flex items-center gap-3 rounded-2xl bg-white p-4 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
                >
                  <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-contain bg-white" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate">{item.name}</h3>
                    <p className="mt-1 text-sm font-bold text-[#312E81]">{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => handleRemove(item.id)} className="rounded-md p-1 text-[#A09BA8] transition hover:scale-110 hover:text-red-500 active:scale-90">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[#E9E5EE] bg-white p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#6F6B76]">Subtotal</span>
                <span className="font-bold">{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-[#E9E5EE] pt-4">
                <span className="font-bold">Total</span>
                <span className="font-black text-[#312E81]">{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#E9E5EE] bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-5 w-5 text-[#4338CA]" />
                <span className="font-bold text-[#211F26]">Your Wallet Balance</span>
              </div>
              <div className="flex justify-between text-lg font-black">
                <span>{walletBalance.toLocaleString()}</span>
                <span className={walletBalance >= totalPrice ? 'text-emerald-600' : 'text-red-600'}>
                  {walletBalance >= totalPrice ? 'Sufficient' : 'Insufficient'}
                </span>
              </div>
              {walletBalance < totalPrice && (
                <p className="mt-2 text-xs text-[#6F6B76]">
                  You need {(totalPrice - walletBalance).toLocaleString()} more to complete this purchase.
                </p>
              )}
            </div>

            <div className="fixed bottom-16 left-0 right-0 z-30 flex justify-center">
              <div className="anim-fade-up w-full max-w-md bg-gradient-to-t from-[#F3F4F8] via-[#F3F4F8]/95 to-transparent px-4 pb-3 pt-6">
                <button
                  onClick={handleBuy}
                  disabled={isBuying || walletBalance < totalPrice}
                  className={`w-full flex items-center justify-center gap-2 rounded-full py-5 text-lg font-black transition disabled:opacity-50 ${
                    walletBalance >= totalPrice ? 'bg-[#4338CA] text-white hover:bg-[#3730A3]' : 'bg-[#E9E5EE] text-[#A09BA8]'
                  }`}
                >
                  {isBuying ? (
                    <>
                      <Lock className="h-5 w-5 animate-spin" /> Processing...
                    </>
                  ) : walletBalance < totalPrice ? (
                    <>
                      <Wallet className="h-5 w-5" /> Fund Wallet First
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5" /> Buy from Wallet - {totalPrice.toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Success + account details popup */}
      {purchased && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="anim-pop-in relative w-full max-w-sm rounded-2xl bg-white p-5">
            <button
              onClick={() => setPurchased(null)}
              className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-center text-lg font-black text-[#211F26]">Purchase Successful!</h2>
            <p className="mt-1 text-center text-xs text-[#6F6B76]">
              Here are the account details you bought.
            </p>

            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {purchased.map((item, i) => (
                <div key={i} className="rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] p-3">
                  <p className="text-sm font-bold text-[#211F26]">{item.name}</p>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#6F6B76]">Login / Email</span>
                      <button onClick={() => copy(item.accountEmail)} className="flex items-center gap-1 font-bold text-[#312E81]">
                        {item.accountEmail || '—'} <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#6F6B76]">Password</span>
                      <button onClick={() => copy(item.accountPassword)} className="flex items-center gap-1 font-bold text-[#312E81]">
                        {item.accountPassword || '—'} <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    {item.code && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#6F6B76]">Account No.</span>
                        <span className="font-bold text-[#312E81]">{item.code}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate(routes.orders())}
              className="mt-4 w-full rounded-full bg-[#4338CA] py-3 text-sm font-black text-white"
            >
              View My Purchases
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BasketPage
