// Конфигурация на JS, а не на TypeScript.
//
// jest.config.ts требовал ts-node для разбора, а его не было в зависимостях:
// после чистой установки `npm test` падал с «Jest: 'ts-node' is required»,
// то есть набор тестов не запускался вообще — ни у нового разработчика,
// ни в CI. Страховка была, но не работала.
//
// Ставить зависимость ради разбора четырёх строк противоречит техническим
// рамкам конституции. Тот же конфиг на обычном JS не требует ничего.
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

export default createJestConfig({
  testEnvironment: 'jsdom',
})
