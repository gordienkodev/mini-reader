import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createComment, deleteComment, getBook } from './api/books'
import type { Book } from './types/book'

export default function App() {
  const [book, setBook] = useState<Book | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<number[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    getBook(1, controller.signal)
      .then(setBook)
      .catch((error: Error) => {
        if (!controller.signal.aborted) {
          setError(`Could not load the book. ${error.message}`)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedText = text.trim()
    if (!book || !trimmedText || submitting) return

    setSubmitting(true)
    setError('')

    try {
      const comment = await createComment(book.id, trimmedText)

      setBook((current) => current && {
        ...current,
        comments: [...current.comments, comment],
      })
      setText('')
    } catch (error) {
      setError(`Could not add the comment. ${(error as Error).message}`)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (deleting.includes(id)) return

    setDeleting((current) => [...current, id])
    setError('')

    try {
      await deleteComment(id)

      setBook((current) => current && {
        ...current,
        comments: current.comments.filter((comment) => comment.id !== id),
      })
    } catch (error) {
      setError(`Could not delete the comment. ${(error as Error).message}`)
    } finally {
      setDeleting((current) => current.filter((commentId) => commentId !== id))
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-8">
      {loading && <p role="status">Loading...</p>}
      {!book && error && <p role="alert" className="text-red-700">{error}</p>}

      {book && (
        <>
          <article className="rounded-xl border border-gray-200 p-5 sm:p-8">
            <h1 className="text-3xl font-bold wrap-break-word">{book.title}</h1>
            <p className="mt-2 text-gray-600">{book.author}</p>
            <p className="mt-8 leading-relaxed wrap-break-word whitespace-pre-wrap">{book.content}</p>
          </article>

          <section aria-labelledby="comments-heading" className="mt-8">
            <h2 id="comments-heading" className="text-xl font-semibold">
              Comments ({book.comments.length})
            </h2>

            <form onSubmit={handleSubmit} className="mt-4">
              <label htmlFor="comment-text" className="sr-only">Write a comment</label>
              <textarea
                id="comment-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Write a comment..."
                rows={4}
                maxLength={1000}
                readOnly={submitting}
                className="block w-full rounded-lg border border-gray-300 p-3"
              />
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="mt-2 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Add comment'}
              </button>
            </form>

            {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}

            <ul className="mt-6 space-y-4">
              {book.comments.map((comment) => {
                const isDeleting = deleting.includes(comment.id)

                return (
                  <li key={comment.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-semibold wrap-anywhere">{comment.user.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        disabled={isDeleting}
                        className="shrink-0 text-sm text-red-700 hover:underline disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    <p className="mt-2 wrap-break-word whitespace-pre-wrap">{comment.text}</p>
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      )}
    </main>
  )
}
