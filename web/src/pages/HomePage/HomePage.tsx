import React, { useState, useEffect } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useAuth } from 'src/contexts/AuthContexts'
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from 'src/lib/firebase'
import { Wallet, Users, Globe } from 'lucide-react'
import { COUNTRIES, countryMatches } from 'src/lib/constants'
import { Flag } from 'src/components/Flag/Flag'
import { SocialIcon } from 'src/components/SocialIcon/SocialIcon'

interface Product {
  id: string
  name: string
  category: string
  country: string
  followers: string
  accountAge: string
  price: number
  image: string
  description: string
}

const CATEGORIES = ['All Accounts', 'TikTok', 'Instagram', 'Facebook', 'X (Twitter)', 'WhatsApp', 'Buy Number']

const HomePage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All Accounts')
  const [countryFilter, setCountryFilter] = useState('All Countries')
  const [loading, setLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[]
      setProducts(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    const loadBalance = async () => {
      const docRef = doc(db, 'profiles', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setWalletBalance(docSnap.data()?.walletBalance || 0)
      }
    }
    loadBalance()
  }, [user])

  const matchCategory = (productCategory: string, selected: string) => {
    if (selected === 'All Accounts') return true
    const pc = (productCategory || '').toLowerCase().trim()
    const sc = selected.toLowerCase().trim()
    const key = sc === 'x (twitter)' ? 'twitter' : sc
    return pc.includes(key) || pc.includes(sc)
  }

  const filteredProducts = products.filter((p) => {
    const catOk = matchCategory(p.category, selectedCategory)
    const countryOk = countryMatches(p.country, countryFilter)
    return catOk && countryOk
  })

  const getFirstName = () => {
    if (!user) return 'there'
    const name = user.displayName || user.email?.split('@')[0] || 'there'
    return name.split(' ')[0]
  }


  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-md bg-[#F3F4F8] p-4 font-sans text-center">
        <div className="anim-shimmer h-96 w-full rounded-2xl mx-auto" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EEF0FF] via-[#F3F4F8] to-[#E8EBFF] p-4 pb-24">
      <div className="anim-fade-up mb-4 space-y-3">
        <div>
          <h1 className="text-2xl font-black text-[#211F26]">Hello, {getFirstName()}</h1>
          <p className="text-sm text-[#6F6B76]">Welcome to FlyHub</p>
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-[#312E81] to-[#4338CA] p-5 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Wallet Balance</p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-3xl font-black leading-none">{walletBalance.toLocaleString()}</p>
            <button
              onClick={() => navigate(routes.fundWallet())}
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#312E81] transition active:scale-95"
            >
              <Wallet className="h-4 w-4" /> Fund Wallet
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isAll = cat === 'All Accounts'
          const active = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${active ? 'bg-[#4338CA] text-white border-[#4338CA]' : 'bg-white text-[#6F6B76] border-[#E9E5EE]'}`}
            >
              {isAll ? (
                <Globe className="h-3.5 w-3.5" />
              ) : (
                <SocialIcon platform={cat} size={14} colored={!active} />
              )}
              <span>{isAll ? 'All' : cat}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setCountryFilter('All Countries')}
          className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${countryFilter === 'All Countries' ? 'border-[#4338CA] bg-[#4338CA] text-white' : 'border-[#E9E5EE] bg-white text-[#6F6B76]'}`}
        >
          <Globe className="h-3.5 w-3.5" /> All Countries
        </button>
        {COUNTRIES.map((c) => (
          <button
            key={c}
            onClick={() => setCountryFilter(c)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${countryFilter === c ? 'border-[#4338CA] bg-[#4338CA] text-white' : 'border-[#E9E5EE] bg-white text-[#6F6B76]'}`}
          >
            <Flag country={c} /> {c}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col space-y-2">
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center border border-[#E9E5EE]">
            <p className="text-sm text-[#6F6B76]">No accounts found</p>
          </div>
        ) : (
          filteredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={routes.productDetail({ id: product.id })}
              className="anim-fade-up group flex items-center gap-3 rounded-2xl bg-white p-2 border border-white/70 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
              style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
            >
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                className="h-24 w-24 rounded-lg object-cover bg-white transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#4338CA]/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[#4338CA]">
                    <SocialIcon platform={product.category} size={11} /> {product.category}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-bold text-[#211F26] truncate">{product.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px] text-[#6F6B76]">
                  {product.followers && (
                    <span className="inline-flex items-center gap-0.5">
                      <Users className="h-2.5 w-2.5" /> {product.followers}
                    </span>
                  )}
                  {product.country && <span className="inline-flex items-center gap-1"><Flag country={product.country} /> {product.country}</span>}
                  {product.accountAge && <span>{product.accountAge}</span>}
                </div>
                <p className="mt-1 text-sm font-bold text-[#312E81]">{product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-6 text-center">
        <Link to={routes.basket()} className="inline-flex items-center gap-2 rounded-full bg-[#312E81] px-6 py-2.5 text-sm font-bold text-white">
          Go to Checkout
        </Link>
      </div>
    </div>
  )
}

export default HomePage
