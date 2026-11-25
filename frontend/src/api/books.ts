import type { Book, Comment } from '../types/book'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers)
  headers.set('Accept', 'application/json')

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export function getBook(id: number, signal?: AbortSignal) {
  return request<Book>(`/api/books/${id}`, { signal })
}

export function createComment(bookId: number, text: string) {
  return request<Comment>(`/api/books/${bookId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

export function deleteComment(id: number) {
  return request<void>(`/api/comments/${id}`, { method: 'DELETE' })
}
