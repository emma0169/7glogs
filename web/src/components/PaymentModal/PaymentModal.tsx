// web/src/components/PaymentModal/PaymentModal.tsx
import React, { useState, useEffect } from 'react'
import { X, CreditCard, Building2, Wallet, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Loader2, Mail, Phone } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (reference: string) => void
  amount: number
  email: string
  orderTitle?: string
  description?: string
}

declare global {
  interface Window {
    PaystackPop: any
  }
}

// Your Paystack keys from dashboard
const PAYSTACK_PUBLIC_KEY = 'pk_live_1868667df0704f583055b189f21c85769a6ddebd'

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  email,
  orderTitle = 'FlyHub Account Order',
  description = 'Digital account payment',
}) => {
  const [method, setMethod] = useState<'card' | 'transfer' | 'wallet'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [paystackReady, setPaystackReady] = useState(
    () => typeof window !== 'undefined' && typeof window.PaystackPop !== 'undefined'
  )

  useEffect(() => {
    if (typeof window.PaystackPop !== 'undefined') {
      setPaystackReady(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => setPaystackReady(true)
    script.onerror = () => setPaystackReady(false)
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  const handlePay = () => {
    if (!paystackReady) {
      alert('Payment system is loading. Please wait a moment and try again.')
      return
    }
    if (!email) {
      alert('Please provide an email address.')
      return
    }

    setIsProcessing(true)

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount * 100, // Paystack charges in kobo
      currency: 'NGN',
      ref: `FlyHub-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      callback: (response: any) => {
        setIsProcessing(false)
        setIsComplete(true)
        setTimeout(() => {
          onSuccess(response.reference)
        }, 1000)
      },
      onClose: () => {
        setIsProcessing(false)
        alert('Payment cancelled. Your order was not completed.')
      },
    })

    handler.openIframe()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#E9E5EE]">
        {/* Header */}
        <div className="bg-[#4338CA] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC928]">
                Secure Payment Gateway
              </span>
              <h3 className="text-xl font-extrabold">{orderTitle}</h3>
              <p className="text-xs text-white/80 mt-1">{description}</p>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <span className="text-xs text-white/80">Total to Pay</span>
            <span className="text-2xl font-black text-[#FFC928]">
              {amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isComplete ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-extrabold text-[#211F26]">Payment Confirmed!</h4>
              <p className="text-xs text-[#6F6B76]">Your account details will be delivered shortly.</p>
            </div>
          ) : (
            <>
              {/* Payment Method Switcher */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                    method === 'card'
                      ? 'border-[#4338CA] bg-[#EEF0FF] text-[#4338CA] shadow-sm'
                      : 'border-[#E9E5EE] bg-white text-[#6F6B76] hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('transfer')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                    method === 'transfer'
                      ? 'border-[#4338CA] bg-[#EEF0FF] text-[#4338CA] shadow-sm'
                      : 'border-[#E9E5EE] bg-white text-[#6F6B76] hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('wallet')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                    method === 'wallet'
                      ? 'border-[#4338CA] bg-[#EEF0FF] text-[#4338CA] shadow-sm'
                      : 'border-[#E9E5EE] bg-white text-[#6F6B76] hover:bg-gray-50'
                  }`}
                >
                  <Wallet className="h-4 w-4" />
                  <span>FlyHub Wallet</span>
                </button>
              </div>

              {/* Method Details */}
              {method === 'card' && (
                <div className="rounded-2xl border border-[#E9E5EE] bg-[#F7F8FC] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#6F6B76]">
                    <span>Payment Gateway</span>
                    <span className="font-bold text-[#211F26]">Paystack (Secure)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6F6B76]">
                    <span>Amount</span>
                    <span className="font-bold text-[#211F26]">{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6F6B76]">
                    <span>Currency</span>
                    <span className="font-bold text-[#211F26]">NGN</span>
                  </div>
                  <p className="text-[11px] text-[#6F6B76] border-t border-[#E9E5EE] pt-2">
                    Powered by Paystack - secure, encrypted payment processing.
                  </p>
                </div>
              )}

              {method === 'transfer' && (
                <div className="rounded-2xl border border-[#E9E5EE] bg-[#F7F8FC] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F6B76]">Bank Name:</span>
                    <span className="font-bold text-[#211F26]">Moniepoint MFB / FlyHub</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F6B76]">Account Number:</span>
                    <span className="font-mono text-base font-black text-[#4338CA] tracking-wider">
                      812 900 1122
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F6B76]">Beneficiary:</span>
                    <span className="font-bold text-[#211F26]">FlyHub Orders</span>
                  </div>
                  <p className="text-[11px] text-[#6F6B76] border-t border-[#E9E5EE] pt-2">
                    Transfer exactly {amount.toLocaleString()}. Payment verifies automatically within 5 minutes.
                  </p>
                </div>
              )}

              {method === 'wallet' && (
                <div className="rounded-2xl border border-[#E9E5EE] bg-[#F7F8FC] p-4 space-y-2 text-center">
                  <span className="text-xs text-[#6F6B76]">Available FlyHub Wallet Balance</span>
                  <div className="text-2xl font-black text-emerald-600">0.00</div>
                  <p className="text-[11px] text-[#6F6B76]">
                    Fund your wallet first to use this payment method.
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing || (method === 'wallet')}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold transition disabled:opacity-50 ${
                  method === 'wallet'
                    ? 'bg-[#E9E5EE] text-[#A09BA8]'
                    : 'bg-[#FFC928] text-[#4338CA] shadow-lg hover:bg-[#E5B420] active:scale-95'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : method === 'wallet' ? (
                  <>
                    <Wallet className="h-5 w-5" /> Fund Wallet First
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    <span>Pay {amount.toLocaleString()} with Paystack</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-[#6F6B76]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Payment Processing</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E9E5EE] bg-[#F7F8FC] p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-[#6F6B76]">
            <Mail className="h-3 w-3" />
            <span>support@flyhub.com</span>
            <Phone className="h-3 w-3 ml-2" />
            <span>+234 800 000 0000</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
