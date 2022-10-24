export interface Questionbank {
  questionbankId: string
  createdAt: string
  question: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
