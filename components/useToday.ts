import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000)
  return () => clearInterval(timer)
}
function snapshot() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const serverSnapshot = () => ''

export default function useToday() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
