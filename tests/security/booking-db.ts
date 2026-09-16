// In-memory database boundary: no Prisma client or external connection is loaded.
export const rows: any[] = []
export const limits = new Map<string, any>()
let queue = Promise.resolve()
function matches(row: any, where: any = {}): boolean {
  return Object.entries(where).every(([key, value]: [string, any]) => {
    if (value && typeof value === 'object') {
      if ('gte' in value && row[key] < value.gte) return false
      if ('lte' in value && row[key] > value.lte) return false
      if ('not' in value && row[key] === value.not) return false
      return true
    }
    return row[key] === value
  })
}
export const db: any = {
  appointment: {
    findMany: async ({ where }: any = {}) => rows.filter(row => matches(row, where)),
    count: async ({ where }: any) => rows.filter(row => matches(row, where)).length,
    findUnique: async ({ where }: any) => rows.find(row => matches(row, where)) ?? null,
    create: async ({ data }: any) => {
      const row = { id: `test-${rows.length}`, staffId: null, status: 'active', createdAt: new Date(), ...data }
      rows.push(row)
      return row
    },
    update: async ({ where, data }: any) => {
      const row = rows.find(row => matches(row, where))
      if (!row) throw new Error('missing')
      Object.assign(row, data)
      return row
    },
    delete: async ({ where }: any) => rows.splice(rows.findIndex(row => matches(row, where)), 1)[0],
  },
  loginRateLimit: {
    findUnique: async ({ where }: any) => limits.get(where.key) ?? null,
    upsert: async ({ where, create, update }: any) => {
      const previous = limits.get(where.key)
      const row = previous ? { ...previous, ...update } : create
      limits.set(where.key, row)
      return row
    },
  },
  $transaction: async (work: any) => {
    let release: (() => void) | undefined
    const tx = { ...db, $executeRaw: async () => {
      const previous = queue
      queue = new Promise<void>(resolve => { release = resolve })
      await previous
      return 1
    } }
    try { return await work(tx) } finally { release?.() }
  },
}
