import { db } from './config'
import {
 doc, getDoc, setDoc, updateDoc,
 collection, getDocs, addDoc,
 deleteDoc, serverTimestamp
} from 'firebase/firestore'
// PROFILE
export const getProfile = async (uid) => {
 const snap = await getDoc(doc(db, 'users', uid, 'profile', 'info'))
 return snap.exists() ? snap.data() : null
}
export const saveProfile = (uid, data) =>
 setDoc(doc(db, 'users', uid, 'profile', 'info'), data, { merge: true })
// GOALS
export const getGoals = async (uid) => {
 const snap = await getDocs(collection(db, 'users', uid, 'goals'))
 return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
export const addGoal = (uid, goal) =>
 addDoc(collection(db, 'users', uid, 'goals'), { ...goal, createdAt:
serverTimestamp() })
export const updateGoal = (uid, goalId, data) =>
 updateDoc(doc(db, 'users', uid, 'goals', goalId), data)
export const deleteGoal = (uid, goalId) =>
 deleteDoc(doc(db, 'users', uid, 'goals', goalId))
// HEALTH
export const getHealth = async (uid) => {
 const snap = await getDoc(doc(db, 'users', uid, 'health', 'today'))
 return snap.exists() ? snap.data() : null
}
export const saveHealth = (uid, data) =>
 setDoc(doc(db, 'users', uid, 'health', 'today'), { ...data, date:
serverTimestamp() }, { merge: true })
// PROGRESS
export const getProgress = async (uid) => {
 const snap = await getDoc(doc(db, 'users', uid, 'progress', 'current'))
 return snap.exists() ? snap.data() : null
}
export const saveProgress = (uid, data) =>
 setDoc(doc(db, 'users', uid, 'progress', 'current'), data, { merge: true })
// STREAK
export const updateStreak = async (uid) => {
 const ref = doc(db, 'users', uid, 'progress', 'current')
 const snap = await getDoc(ref)
 const data = snap.exists() ? snap.data() : {}
 const today = new Date().toDateString()
 const yesterday = new Date(Date.now() - 86400000).toDateString()
 if (data.lastStudyDate === today) return data.streak || 1
 const streak = data.lastStudyDate === yesterday ? (data.streak || 0) + 1 : 1
 await setDoc(ref, { streak, lastStudyDate: today }, { merge: true })
 return streak
}
// GRADES for charts
export const saveWeeklyGrade = (uid, week, score) =>
 setDoc(doc(db, 'users', uid, 'grades', week), { week, score, savedAt:
serverTimestamp() })
export const getWeeklyGrades = async (uid) => {
 const snap = await getDocs(collection(db, 'users', uid, 'grades'))
 return snap.docs.map(d => d.data()).sort((a,b) =>
a.week.localeCompare(b.week))
}