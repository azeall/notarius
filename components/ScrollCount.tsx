/**
 * Число, которое досчитывается по мере прокрутки.
 *
 * Заменяет прежний CountUp — клиентский компонент, который стартовал с нуля
 * и досчитывал по таймеру. У него был изъян не в анимации: в серверном HTML
 * стояло «0 лет», и стаж нотариуса уходил в поисковую выдачу как ноль.
 *
 * Здесь настоящее число всегда в разметке — его видят поисковик и
 * скринридер. Анимированный двойник накладывается поверх и существует
 * только там, где браузер умеет animation-timeline; он aria-hidden.
 * Где не умеет — просто стоит число, и это совершенно нормально.
 *
 * Компонент серверный: считать тут нечего.
 */
export default function ScrollCount({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) {
  return (
    <span className="cnt nums" data-target={value}>
      <span className="cnt-real">{value.toLocaleString('ru-RU')}{suffix}</span>
      <span className="cnt-anim" aria-hidden />
      <span className="cnt-suffix" aria-hidden>{suffix}</span>
    </span>
  )
}
