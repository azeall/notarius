import { notarybotEnabled, notarybotSlug, notarybotUrl } from '@/lib/notarybot'

/**
 * Виджет приёма заявок: подбор услуги, перечень документов, загрузка сканов
 * по одноразовой ссылке и запись на приём.
 *
 * Сам виджет живёт в отдельном сервисе и открывается в iframe с его домена —
 * персональные данные клиента не проходят через этот сайт.
 *
 * Своя плавающая кнопка виджету не нужна: на сайте уже есть «Записаться на
 * приём», она и открывает его через window.notarybot.open().
 */
export default function NotaryBotWidget() {
  if (!notarybotEnabled) return null

  return (
    <script
      src={`${notarybotUrl}/embed.js`}
      data-notary={notarybotSlug}
      data-launcher="none"
      defer
    />
  )
}
