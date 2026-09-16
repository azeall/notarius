import { login } from '@/lib/auth-login'
export async function POST(req: Request) { return login(req, 'admin') }
