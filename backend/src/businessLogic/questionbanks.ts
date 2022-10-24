import { getQuestionbanks, handleCreateAttachmentPresignedUrl, handleDeleteQuestionbank, handleUpdateQuestionbank, saveQuestionbank } from "../helpers/questionbanks";
import { QuestionbankItem } from "../models/QuestionbankItem";
import * as uuid from "uuid";



export async function getQuestionbanksForUser( userId: string) {
    return await getQuestionbanks( userId );
}

export async function createQuestionbank( userId: string, dueDate: string, question: string ) {
  const questionbankItem = {
    userId: userId,
    questionbankId: uuid.v4(),
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    dueDate: dueDate,
    question: question        
  }
  
  return await saveQuestionbank( questionbankItem ); 
}

export async function updateQuestionbank( questionbankItem: QuestionbankItem, questionbankId: string, userId: string) {
  return await handleUpdateQuestionbank( questionbankId, userId, questionbankItem );
}

export async function deleteQuestionbank( questionbankId: string, userId: string) {
  return await handleDeleteQuestionbank( questionbankId, userId );
}


export async function createAttachmentPresignedUrl( questionbankId: string, userId: string) {
  return await handleCreateAttachmentPresignedUrl( questionbankId, userId );
}


