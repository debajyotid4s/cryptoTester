import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/cryptoTester/'
    return location.pathname.includes(path)
  }

  return (
    <nav className="sticky top-0 z-50 w-full px-8 py-4 flex items-center justify-between bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-md flex items-center justify-center ring-2 ring-red-500/60">
          <Shield className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h1 className="font-cinzel text-lg font-semibold text-white tracking-wide">
            Cryptographic Realm
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link 
          to="/" 
          className={`text-sm tracking-widest uppercase transition-colors duration-200 ${
            location.pathname === '/' 
              ? 'text-white' 
              : 'text-white/60 hover:text-white'
          }`}
        >
          Realm Map
        </Link>
        <Link 
          to="/cipher/caesar" 
          className={`text-sm tracking-widest uppercase transition-colors duration-200 ${
            location.pathname.includes('/cipher') 
              ? 'text-white' 
              : 'text-white/60 hover:text-white'
          }`}
        >
          Cipher Chambers
        </Link>
      </div>

      <button 
        className="md:hidden p-2 text-white/60"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden absolute top-16 left-0 right-0 pb-4 bg-black/80 backdrop-blur-md border-b border-white/10 px-8"
        >
          <div className="flex flex-col gap-4 pt-4">
            <Link 
              to="/" 
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-widest uppercase text-white/60 hover:text-white"
            >
              Realm Map
            </Link>
            <Link 
              to="/cipher/caesar" 
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-widest uppercase text-white/60 hover:text-white"
            >
              Cipher Chambers
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}