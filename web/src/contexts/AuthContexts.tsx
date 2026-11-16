// src/contexts/AuthContexts.tsx
import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'

import { auth, db } from 'src/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export interface AuthContextType {
  googleSignIn: () => Promise<User | null>
  logOut: () => Promise<void>
  user: User | null
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
  hasRole?: (roles?: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get('ref')
      if (ref) localStorage.setItem('flyhub_referral', ref)
    } catch (e) {
      console.warn('Could not read referral code', e)
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      console.log(
        'Firebase Auth State:',
        currentUser ? `Logged in as ${currentUser.email}` : 'Logged out'
      )
    })
    return () => unsubscribe()
  }, [])

  const googleSignIn = async (): Promise<User | null> => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
      setLoading(false)

      // Automatically save the user and attach their referrer if this is a new account
      if (result.user) {
        const uid = result.user.uid
        const userRef = doc(db, 'users', uid)
        const userSnap = await getDoc(userRef)
        const isNewUser = !userSnap.exists()

        await setDoc(
          userRef,
          {
            name: result.user.displayName || 'User',
            email: result.user.email || '',
            uid,
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        )

        const pendingRef = localStorage.getItem('flyhub_referral')
        if (pendingRef) {
          if (isNewUser && pendingRef !== uid) {
            const profileRef = doc(db, 'profiles', uid)
            const profileSnap = await getDoc(profileRef)
            const existing = profileSnap.exists() ? profileSnap.data() : {}
            if (!existing.referredBy) {
              await setDoc(
                profileRef,
                { referredBy: pendingRef, referredAt: serverTimestamp() },
                { merge: true }
              )
            }
          }
          localStorage.removeItem('flyhub_referral')
        }
      }

      return result.user
    } catch (error) {
      setLoading(false)
      console.error('Error during google sign-in:', error)
      throw error
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Error during sign out:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    googleSignIn,
    logOut,
    user,
    currentUser: user,
    isAuthenticated: !!user,
    loading,
    hasRole: () => true,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider')
  }
  return context
}
