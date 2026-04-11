/**
 * App.jsx
 * Root component. Composes the Header and the Home page.
 * Dark mode is always applied (class="dark" on <html> in index.html).
 */

import React from 'react'
import Header from './components/Header'
import Home   from './pages/Home'

const App = () => {
  return (
    <div className="min-h-screen font-body text-ink-200">
      <Header />
      <Home />
    </div>
  )
}

export default App
