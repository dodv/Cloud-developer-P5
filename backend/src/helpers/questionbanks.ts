import { QuestionbanksAccess } from './questionbanksAcess'
// import { uploadAttachment } from './attachmentUtils'
import { QuestionbankItem } from '../models/QuestionbankItem'
// import { CreateQuestionbankRequest } from '../requests/CreateQuestionbankRequest'
import { UpdateQuestionbankRequest } from '../requests/UpdateQuestionbankRequest'
// import { createLogger } from '../utils/logger'
// import * as createError from 'http-errors'

// Implement businessLogic

// const logger = createLogger('QuestionbanksBusinessLogic')

const questionbanksAccess = new QuestionbanksAccess()

export async function saveQuestionbank(questionbankItem: QuestionbankItem) {
  return await questionbanksAccess.persistQuestionbank(questionbankItem)
}

export async function getQuestionbanks(userId: string) {
  return await questionbanksAccess.getAllQuestionbanks(userId)
}

export async function handleUpdateQuestionbank(
  questionbankId: string,
  userId: string,
  questionbankUpdate: UpdateQuestionbankRequest
) {
  return await questionbanksAccess.updateQuestionbank(questionbankId, userId, questionbankUpdate)
}

export async function handleDeleteQuestionbank(questionbankId: string, userId: string) {
  return await questionbanksAccess.deleteQuestionbank(questionbankId, userId)
}

export async function handleCreateAttachmentPresignedUrl(
  questionbankId: string,
  userId: string
) {
  return await questionbanksAccess.updateAttachmentUrl( questionbankId, userId)
}
