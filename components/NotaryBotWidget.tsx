/**
 * Виджет приёма заявок: подбор услуги, перечень документов, загрузка сканов
 * по одноразовой ссылке и запись на приём.
 *
 * Сам виджет живёт в отдельном сервисе и открывается в iframe с его домена —
 * персональные данные клиента не проходят через этот сайт.
 *
 * Подключается только когда заданы обе переменные окружения, поэтому без
 * настроенного сервиса на сайте не появляется ничего:
 *
 *   NEXT_PUBLIC_NOTARYBOT_URL  — адрес сервиса, например https://zayavki.example.ru
 *   NEXT_PUBLIC_NOTARYBOT_SLUG — код нотариуса в этом сервисе
 */
export default function NotaryBotWidget() {
  const base = process.env.NEXT_PUBLIC_NOTARYBOT_URL
  const slug = process.env.NEXT_PUBLIC_NOTARYBOT_SLUG

  if (!base || !slug) return null

  return (
    <script
      src={`${base.replace(/\/+$/, '')}/embed.js`}
      data-notary={slug}
      data-label="Подготовить документы"
      data-accent="#b89a5a"
      defer
    />
  )
}
