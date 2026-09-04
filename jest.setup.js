// jsdom не знает IntersectionObserver, а счётчики на первом экране его заводят.
// Без заглушки любой render(<Hero />) падает с «IntersectionObserver is not
// defined», и тест сообщает не о поломке сайта, а о пробеле в браузере-заглушке.
class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

global.IntersectionObserver = IntersectionObserverStub
window.IntersectionObserver = IntersectionObserverStub
