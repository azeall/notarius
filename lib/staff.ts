// Public account labels only. Credentials live in the server-only auth module.
export type StaffMember = { id: string; name: string; username: string }
export const STAFF_LIST: StaffMember[] = Array.from({ length: 5 }, (_, index) => {
  const n = index + 1
  return {
    id: `staff_${n}`,
    name: process.env[`STAFF_${n}_NAME`] ?? `Помощник ${n}`,
    username: process.env[`STAFF_${n}_USER`] ?? `helper${n}`,
  }
})
export function findStaffById(id: string): StaffMember | null {
  return STAFF_LIST.find(s => s.id === id) ?? null
}
