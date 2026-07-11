import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

const CACHE_RESET_FLAG = "__crypto_realm_cache_reset__";

async function clearLegacyClientState() {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(CACHE_RESET_FLAG) === "1") return false;

  let cleared = false;

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length > 0) {
      await Promise.all(registrations.map((registration) => registration.unregister()));
      cleared = true;
    }
  }

  if ("caches" in window) {
    const keys = await caches.keys();
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => caches.delete(key)));
      cleared = true;
    }
  }

  if (cleared) {
    sessionStorage.setItem(CACHE_RESET_FLAG, "1");
    window.location.reload();
    return true;
  }

  return false;
}

const root = ReactDOM.createRoot(document.getElementById('root'))

(async () => {
  if (!(await clearLegacyClientState())) {
    root.render(
      <StrictMode>
        <BrowserRouter basename="/cryptoTester">
          <App />
        </BrowserRouter>
      </StrictMode>,
    )
  }
})()