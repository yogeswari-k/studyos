import { createContext, useContext, useState, useEffect } from 'react'
import { LIGHT, DARK } from './theme'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('studyos-theme') === 'dark'
  })

  const T = isDark ? DARK : LIGHT

  const toggleTheme = () => {
    setIsDark(d => {
      const next = !d
      localStorage.setItem('studyos-theme', next ? 'dark' : 'light')
      return next
    })
  }

  useEffect(() => {
    document.body.style.background = T.bg
    document.body.style.color = T.textPrimary
  }, [T.bg, T.textPrimary])

  return (
    <ThemeContext.Provider value={{ T, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)