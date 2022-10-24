export interface QuestionbankItem {
  userId: string
  questionbankId: string
  createdAt: string
  question: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
