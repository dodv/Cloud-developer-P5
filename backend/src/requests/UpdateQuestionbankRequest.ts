/**
 * Fields in a request to update a single QUESTIONBANK item.
 */
export interface UpdateQuestionbankRequest {
  question: string
  dueDate: string
  done: boolean
}