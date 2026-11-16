import React, { useState, useEffect, useMemo } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Search, Globe } from 'lucide-react'
import { Metadata } from '@redwoodjs/web'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from 'src/lib/firebase'
import { useCart } from 'src/components/CartContext/CartContext'
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

const PLATFORMS = ['All', 'TikTok', 'Instagram', 'Facebook', 'X (Twitter)', 'WhatsApp', 'Buy Number']
const COUNTRY_FILTERS = ['All Countries', ...COUNTRIES]

const SearchPage = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [countryFilter, setCountryFilter] = useState('All Countries')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]
      data.sort((a, b) => (a.price || 0) - (b.price || 0))
      setProducts(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchPlatform = platformFilter === 'All' || p.category === platformFilter
      const matchCountry = countryMatches(p.country, countryFilter)
      return matchSearch && matchPlatform && matchCountry
    })
  }, [searchTerm, platformFilter, countryFilter, products])

  return (
    <div className="min-h-screen bg-[#F3F4F8]">
      <Metadata title="Search Accounts — STREAM" description="Search social media accounts" />

      <header className="sticky top-0 z-10 bg-white border-b border-[#E9E5EE] p-4">
        <div className="mx-auto max-w-md">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-[#6F6B76]" />
            <div className="flex-1 rounded-full bg-[#F5F5F5] px-4 py-3 flex items-center">
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-sm text-[#211F26]"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pt-0 pb-20">
        <div className="anim-fade-up mb-4 text-xl font-bold text-[#211F26]">Search Results</div>

        <div className="anim-fade-up mb-4 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {PLATFORMS.map((plat) => {
            const active = platformFilter === plat
            return (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                  active
                    ? 'bg-[#312E81] text-white scale-105'
                    : 'border border-[#E9E5EE] bg-white text-[#6F6B76] hover:text-[#312E81]'
                }`}
              >
                {plat === 'All' ? (
                  <Globe className="h-3.5 w-3.5" />
                ) : (
                  <SocialIcon platform={plat} size={14} colored={!active} />
                )}
                {plat}
              </button>
            )
          })}
        </div>

        <div className="anim-fade-up mb-4 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {COUNTRY_FILTERS.map((cty) => (
            <button
              key={cty}
              onClick={() => setCountryFilter(cty)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                countryFilter === cty
                  ? 'bg-[#4338CA] text-white scale-105'
                  : 'border border-[#E9E5EE] bg-white text-[#6F6B76] hover:text-[#312E81]'
              }`}
            >
              {cty === 'All Countries' ? <Globe className="h-3.5 w-3.5" /> : <Flag country={cty} />}
              {cty === 'All Countries' ? 'All' : cty}
            </button>
          ))}
        </div>

        <section>
          {loading ? (
            <div className="flex flex-col space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-2">
                  <div className="anim-shimmer h-28 w-28 rounded-lg" />
                  <div className="flex-1 space-y-2 py-2">
                    <div className="anim-shimmer h-4 w-2/3 rounded" />
                    <div className="anim-shimmer h-3 w-full rounded" />
                    <div className="anim-shimmer h-4 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="anim-pop-in py-12 text-center text-[#6F6B76]">
              <p>No accounts found</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {filteredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={routes.productDetail({ id: product.id })}
                  className="anim-fade-up group flex items-center gap-3 rounded-2xl bg-white p-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
                  style={{ animationDelay: `${Math.min(index * 70, 560)}ms` }}
                >
                  <img
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    className="h-28 w-28 rounded-lg object-cover bg-white transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#211F26]">{product.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-[#4338CA]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#4338CA]/10 px-2 py-0.5 uppercase">
                        <SocialIcon platform={product.category} size={11} /> {product.category}
                      </span>
                      {product.country && <span className="inline-flex items-center gap-1"><Flag country={product.country} /> {product.country}</span>}
                      {product.followers && <span>{product.followers}</span>}
                    </div>
                    <p className="mt-2 text-base font-bold text-[#312E81]">
                      {product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default SearchPage
