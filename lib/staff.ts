/**
 * Staff accounts for the notary office.
 *
 * To change names, logins or passwords — set these env vars in
 * Vercel Dashboard → Settings → Environment Variables, then redeploy:
 *
 *   STAFF_1_NAME   default: "Помощник 1"
 *   STAFF_1_USER   default: "helper1"
 *   STAFF_1_PASS   default: "pass1"
 *   ...same pattern up to STAFF_5
 */

export type StaffMember = {
  id: string
  name: string
  username: string
  password: string
}

export const STAFF_LIST: StaffMember[] = [
  {
    id: 'staff_1',
    name:     process.env.STAFF_1_NAME ?? 'Помощник 1',
    username: process.env.STAFF_1_USER ?? 'helper1',
    password: process.env.STAFF_1_PASS ?? 'pass1',
  },
  {
    id: 'staff_2',
    name:     process.env.STAFF_2_NAME ?? 'Помощник 2',
    username: process.env.STAFF_2_USER ?? 'helper2',
    password: process.env.STAFF_2_PASS ?? 'pass2',
  },
  {
    id: 'staff_3',
    name:     process.env.STAFF_3_NAME ?? 'Помощник 3',
    username: process.env.STAFF_3_USER ?? 'helper3',
    password: process.env.STAFF_3_PASS ?? 'pass3',
  },
  {
    id: 'staff_4',
    name:     process.env.STAFF_4_NAME ?? 'Помощник 4',
    username: process.env.STAFF_4_USER ?? 'helper4',
    password: process.env.STAFF_4_PASS ?? 'pass4',
  },
  {
    id: 'staff_5',
    name:     process.env.STAFF_5_NAME ?? 'Помощник 5',
    username: process.env.STAFF_5_USER ?? 'helper5',
    password: process.env.STAFF_5_PASS ?? 'pass5',
  },
]

export function findStaffByCredentials(username: string, password: string): StaffMember | null {
  return STAFF_LIST.find(s => s.username === username && s.password === password) ?? null
}

export function findStaffById(id: string): StaffMember | null {
  return STAFF_LIST.find(s => s.id === id) ?? null
}
