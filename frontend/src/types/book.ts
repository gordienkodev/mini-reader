export interface User {
  id: number
  name: string
}

export interface Comment {
  id: number
  book_id: number
  user_id: number
  text: string
  created_at: string
  user: User
}

export interface Book {
  id: number
  title: string
  author: string
  content: string
  comments: Comment[]
}
