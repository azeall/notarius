/**
 * РќР°СЃС‚СЂРѕР№РєРё СЃРµСЂРІРёСЃР° РїСЂРёС‘РјР° Р·Р°СЏРІРѕРє (СЂРµРїРѕР·РёС‚РѕСЂРёР№ notariusbot).
 *
 * Р‘РѕРµРІРѕРµ Р·РЅР°С‡РµРЅРёРµ Р·Р°РґР°С‘С‚СЃСЏ РїРµСЂРµРјРµРЅРЅС‹РјРё РѕРєСЂСѓР¶РµРЅРёСЏ РІ Vercel:
 *   NEXT_PUBLIC_NOTARYBOT_URL  вЂ” Р°РґСЂРµСЃ СЃРµСЂРІРёСЃР°
 *   NEXT_PUBLIC_NOTARYBOT_SLUG вЂ” РєРѕРґ РЅРѕС‚Р°СЂРёСѓСЃР° РІ СЃРµСЂРІРёСЃРµ
 *
 * РџРѕРєР° СЃРµСЂРІРёСЃ РЅРµ СЂР°Р·РІС‘СЂРЅСѓС‚, РЅРёР¶Рµ Р»РµР¶РёС‚ Р°РґСЂРµСЃ РІСЂРµРјРµРЅРЅРѕРіРѕ С‚СѓРЅРЅРµР»СЏ РґРѕ РјР°С€РёРЅС‹
 * СЂР°Р·СЂР°Р±РѕС‚С‡РёРєР° вЂ” РѕРЅ РїРѕР·РІРѕР»СЏРµС‚ РїРѕСЃРјРѕС‚СЂРµС‚СЊ РІРёРґР¶РµС‚ РІР¶РёРІСѓСЋ, РЅРѕ Р¶РёРІС‘С‚ РЅРµРґРѕР»РіРѕ:
 * Р±РµСЃРїР»Р°С‚РЅС‹Р№ С‚СѓРЅРЅРµР»СЊ РјРµРЅСЏРµС‚ Р°РґСЂРµСЃ РїСЂРё РєР°Р¶РґРѕРј РїРµСЂРµРїРѕРґРєР»СЋС‡РµРЅРёРё. Р•СЃР»Рё РІРёРґР¶РµС‚
 * РїРµСЂРµСЃС‚Р°Р» РѕС‚РєСЂС‹РІР°С‚СЊСЃСЏ, Р·Р°РјРµРЅРёС‚Рµ DEMO_FALLBACK_URL РЅР° С‚РµРєСѓС‰РёР№ Р°РґСЂРµСЃ С‚СѓРЅРЅРµР»СЏ
 * Р»РёР±Рѕ Р·Р°РґР°Р№С‚Рµ РїРµСЂРµРјРµРЅРЅСѓСЋ РѕРєСЂСѓР¶РµРЅРёСЏ.
 */
const DEMO_FALLBACK_URL = 'https://91cba76cd4476e.lhr.life'
const DEMO_FALLBACK_SLUG = 'demo'

export const notarybotUrl = (
  process.env.NEXT_PUBLIC_NOTARYBOT_URL || DEMO_FALLBACK_URL
).replace(/\/+$/, '')

export const notarybotSlug = process.env.NEXT_PUBLIC_NOTARYBOT_SLUG || DEMO_FALLBACK_SLUG

export const notarybotEnabled = Boolean(notarybotUrl && notarybotSlug)

/** РћС‚РєСЂС‹С‚СЊ РІРёРґР¶РµС‚. Р’РѕР·РІСЂР°С‰Р°РµС‚ false, РµСЃР»Рё СЃРєСЂРёРїС‚ РµС‰С‘ РЅРµ Р·Р°РіСЂСѓР·РёР»СЃСЏ. */
export function openNotarybot(): boolean {
  if (typeof window === 'undefined') return false
  const api = (window as unknown as { notarybot?: { open: () => void } }).notarybot
  if (!api) return false
  api.open()
  return true
}
