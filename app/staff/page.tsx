import { Suspense } from 'react'
import StaffDashboard from '@/components/StaffDashboard'

export default function StaffPage() {
  return (
    <Suspense>
      <StaffDashboard />
    </Suspense>
  )
}
