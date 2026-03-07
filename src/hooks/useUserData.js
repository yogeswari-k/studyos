import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import * as db from '../firebase/db'

const DEFAULT_PROFILE  = { name:'Student', major:'Computer Science', year:'Year 1', gpa:'0.0', semester:'Spring 2026', credits:'18' }
const DEFAULT_HEALTH   = { steps:0, stepsGoal:8000, water:0, waterGoal:2.5, sleep:0, sleepGoal:8, mindful:0, mindfulGoal:15, calories:0, bpm:0 }
const DEFAULT_PROGRESS = { study:0, studyGoal:5, academic:0, streak:0 }

export function useUserData() {
  const { user } = useAuth()
  const uid = user?.uid

  const [profile,     setProfile]     = useState(DEFAULT_PROFILE)
  const [goals,       setGoals]       = useState([])
  const [health,      setHealth]      = useState(DEFAULT_HEALTH)
  const [progress,    setProgress]    = useState(DEFAULT_PROGRESS)
  const [saving,      setSaving]      = useState(false)
  const [dataLoaded,  setDataLoaded]  = useState(false)

  // Load all data when user logs in
  useEffect(() => {
    if (!uid) return
    Promise.all([
      db.getProfile(uid),
      db.getGoals(uid),
      db.getHealth(uid),
      db.getProgress(uid),
    ]).then(([p, g, h, pr]) => {
      if (p)  setProfile(p)
      if (g)  setGoals(g)
      if (h)  setHealth(h)
      if (pr) setProgress(pr)
      setDataLoaded(true)
    })
  }, [uid])

  const withSave = async (fn) => {
    setSaving(true)
    await fn()
    setTimeout(() => setSaving(false), 800)
  }

  const updateProfile = (data) => withSave(async () => {
    await db.saveProfile(uid, data)
    setProfile(data)
  })

  const toggleGoal = (goalId) => withSave(async () => {
    const goal = goals.find(g => g.id === goalId)
    await db.updateGoal(uid, goalId, { done: !goal.done })
    setGoals(gs => gs.map(g => g.id === goalId ? { ...g, done: !g.done } : g))
  })

  const addNewGoal = (text, cat = 'Study') => withSave(async () => {
    const ref = await db.addGoal(uid, { text, cat, done: false })
    setGoals(gs => [...gs, { id: ref.id, text, cat, done: false }])
  })

  const removeGoal = (goalId) => withSave(async () => {
    await db.deleteGoal(uid, goalId)
    setGoals(gs => gs.filter(g => g.id !== goalId))
  })

  const updateHealth = (data) => withSave(async () => {
    const next = { ...health, ...data }
    await db.saveHealth(uid, next)
    setHealth(next)
  })

  const updateProgress = (data) => withSave(async () => {
    const next = { ...progress, ...data }
    await db.saveProgress(uid, next)
    setProgress(next)
  })

  return {
    profile, goals, health, progress, saving, dataLoaded,
    updateProfile, toggleGoal, addNewGoal, removeGoal,
    updateHealth, updateProgress,
  }
}
