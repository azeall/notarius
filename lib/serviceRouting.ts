/**
 * Service → Staff routing.
 * Maps service name to staffId (null = notary handles it directly).
 *
 * Configure via Vercel env var SERVICE_ROUTING (JSON):
 *   {"Доверенности":"staff_1","Заверение копий и справок":"staff_2"}
 *
 * Can also be overridden per-appointment via admin reassign.
 */

export type RoutingMap = Record<string, string | null>

function parseRouting(): RoutingMap {
  try {
    const raw = process.env.SERVICE_ROUTING
    if (raw) return JSON.parse(raw) as RoutingMap
  } catch {}
  return {}
}

export const SERVICE_ROUTING: RoutingMap = parseRouting()

/** Returns the default staffId for a service, or null = notary. */
export function getDefaultAssignee(service: string): string | null {
  return SERVICE_ROUTING[service] ?? null
}