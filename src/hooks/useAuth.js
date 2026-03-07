import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const getFriendlyError = (code) => {
    const errors = {
      'auth/user-not-found':        'No account found with this email.',
      'auth/wrong-password':        'Incorrect password. Please try again.',
      'auth/email-already-in-use':  'An account with this email already exists.',
      'auth/weak-password':         'Password must be at least 6 characters.',
      'auth/invalid-email':         'Please enter a valid email address.',
      'auth/too-many-requests':     'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user':  'Google sign-in was cancelled.',
      'auth/network-request-failed':'Network error. Check your connection.',
    }
    return errors[code] || 'Something went wrong. Please try again.'
  }

  const signup = async (email, password, displayName) => {
    setError(null)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      return result.user
    } catch (err) {
      setError(getFriendlyError(err.code))
      throw err
    }
  }

  const login = async (email, password) => {
    setError(null)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      setError(getFriendlyError(err.code))
      throw err
    }
  }

  const loginWithGoogle = async () => {
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      const result   = await signInWithPopup(auth, provider)
      return result.user
    } catch (err) {
      setError(getFriendlyError(err.code))
      throw err
    }
  }

  const logout = async () => {
    setError(null)
    try { await signOut(auth) }
    catch (err) { setError(getFriendlyError(err.code)); throw err }
  }

  const resetPassword = async (email) => {
    setError(null)
    try { await sendPasswordResetEmail(auth, email); return true }
    catch (err) { setError(getFriendlyError(err.code)); throw err }
  }

  return { user, loading, error, signup, login, loginWithGoogle, logout, resetPassword, clearError: () => setError(null) }
}
