/**
 * Staff accounts for the notary office.
 * Credentials are read from environment variables so they can be changed
 * in Vercel dashboard without redeploying code.
 *
 * Vercel env vars to set:
 *   STAFF_1_NAME, STAFF_1_USER, STAFF_1_PASS
 *   STAFF_2_NAME, STAFF_2_USER, STAFF_2_PASS
 *   ...up to STAFF_5
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
    name:     process.env.STAFF_1_NAME ?? 'Елена Соколова',
    username: process.env.STAFF_1_USER ?? 'sokolova',
    password: process.env.STAFF_1_PASS ?? 'staff1pass',
  },
  {
    id: 'staff_2',
    name:     process.env.STAFF_2_NAME ?? 'Дмитрий Власов',
    username: process.env.STAFF_2_USER ?? 'vlasov',
    password: process.env.STAFF_2_PASS ?? 'staff2pass',
  },
  {
    id: 'staff_3',
    name:     process.env.STAFF_3_NAME ?? 'Наталья Морозова',
    username: process.env.STAFF_3_USER ?? 'morozova',
    password: process.env.STAFF_3_PASS ?? 'staff3pass',
  },
  {
    id: 'staff_4',
    name:     process.env.STAFF_4_NAME ?? 'Алексей Громов',
    username: process.env.STAFF_4_USER ?? 'gromov',
    password: process.env.STAFF_4_PASS ?? 'staff4pass',
  },
  {
    id: 'staff_5',
    name:     process.env.STAFF_5_NAME ?? 'Ольга Павлова',
    username: process.env.STAFF_5_USER ?? 'pavlova',
    password: process.env.STAFF_5_PASS ?? 'staff5pass',
  },
]

export function findStaffByCredentials(username: string, password: string): StaffMember | null {
  return STAFF_LIST.find(s => s.username === username && s.password === password) ?? null
}

export function findStaffById(id: string): StaffMember | null {
  return STAFF_LIST.find(s => s.id === id) ?? null
}
