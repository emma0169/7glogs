import React, { useState, useEffect } from 'react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { useCart } from 'src/components/CartContext/CartContext'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from 'src/contexts/AuthContexts'
import { db } from 'src/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { SocialIcon } from 'src/components/SocialIcon/SocialIcon'
import { Flag } from 'src/components/Flag/Flag'

const ProductDetailPage = ({ id }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => {
    const getProduct = async () => {
      try {
        const docRef = doc(db, 'products', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() })
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    getProduct()
  }, [id])

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

  if (loading)
    return (
      <div className="mx-auto min-h-screen max-w-md bg-[#F3F4F8] p-4 font-sans">
        <div className="anim-shimmer h-96 w-full rounded-2xl" />
        <div className="mt-4 space-y-2">
          <div className="anim-shimmer h-6 w-2/3 rounded" />
          <div className="anim-shimmer h-4 w-full rounded" />
          <div className="anim-shimmer h-12 w-full rounded-xl" />
        </div>
      </div>
    )
  if (!product) return <div className="p-10 text-center text-[#6F6B76]">Account not found.</div>

  const totalPrice = product.price
  const canAfford = walletBalance >= totalPrice

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      code: product.code,
      accountEmail: product.accountEmail || '',
      accountPassword: product.accountPassword || '',
    }, 1)
    navigate(routes.basket())
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F3F4F8] font-sans text-[#211F26] pb-40">
      <div className="anim-pop-in relative">
        <Link to={routes.home()} className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 active:scale-90">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <img
          src={product.image || 'https://via.placeholder.com/400x300'}
          alt={product.name}
          className="h-96 w-full object-contain bg-white"
        />
      </div>

      <div className="anim-fade-up bg-white p-4" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#211F26]">{product.name}</h1>
          <p className="text-xl font-bold text-[#312E81]">{product.price.toLocaleString()}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6F6B76]">Platform</p>
            <p className="flex items-center gap-1.5 text-sm font-bold text-[#211F26]">
              <SocialIcon platform={product.category} size={15} /> {product.category}
            </p>
          </div>
          <div className="rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6F6B76]">Country</p>
            <p className="text-sm font-bold text-[#211F26]"><Flag country={product.country} /> {product.country}</p>
          </div>
          {product.followers ? (
            <div className="rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6F6B76]">Followers</p>
              <p className="text-sm font-bold text-[#211F26]">{product.followers}</p>
            </div>
          ) : null}
          {product.accountAge ? (
            <div className="rounded-xl border border-[#E9E5EE] bg-[#F7F8FC] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6F6B76]">Account Age</p>
              <p className="text-sm font-bold text-[#211F26]">{product.accountAge}</p>
            </div>
          ) : null}
        </div>

      </div>

      <div className="anim-fade-up bg-white p-4" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between text-sm">
          <span className="text-[#6F6B76]">Total</span>
          <span className={`font-bold ${canAfford ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 flex justify-center">
        <div className="anim-fade-up w-full max-w-md bg-gradient-to-t from-[#F3F4F8] via-[#F3F4F8]/95 to-transparent px-4 pb-3 pt-6" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={handleAddToCart}
            disabled={!canAfford}
            className={`w-full rounded-full py-4 text-lg font-black text-white transition hover:bg-[#3730A3] active:scale-[0.98] disabled:opacity-50 ${
              canAfford ? 'bg-[#4338CA]' : 'bg-[#E9E5EE] text-[#A09BA8]'
            }`}
          >
            {canAfford ? `Buy Now - ${totalPrice.toLocaleString()}` : 'Insufficient Wallet Balance'}
          </button>
          {!canAfford && (
            <p className="mt-2 text-center text-xs text-[#6F6B76]">
              Fund your wallet to buy this account. <Link to={routes.fundWallet()} className="text-[#4338CA] font-bold hover:underline">Fund Wallet</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
