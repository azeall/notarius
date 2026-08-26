import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import { notary } from '@/lib/data'

describe('Hero', () => {
  it('displays notary name as heading', () => {
    render(<Hero />)
    const surname = notary.name.trim().split(/\s+/)[0]
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(surname)
  })

  // Запись — кнопка, открывающая форму, а не ссылка на /contacts:
  // отправлять человека листать отдельную страницу ради формы незачем.
  it('opens booking from the hero', () => {
    render(<Hero />)
    expect(screen.getByRole('button', { name: /записаться/i })).toBeInTheDocument()
  })

  // Второй вопрос после «сколько стоит» — «что с собой взять».
  it('links to the document checklist', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /какие нужны документы/i })).toHaveAttribute('href', '/visit')
  })

  it('shows the office phone', () => {
    render(<Hero />)
    // Номер ищется по тексту, а не по доступному имени ссылки: в имя попадает
    // ещё и подпись «Телефон конторы», а сам номер полон скобок и плюсов,
    // которые в регулярном выражении пришлось бы экранировать вручную.
    expect(screen.getByText(notary.phone).closest('a')).toHaveAttribute('href', notary.phoneHref)
  })
})
