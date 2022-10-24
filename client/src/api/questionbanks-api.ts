import { apiEndpoint } from '../config'
import { Questionbank } from '../types/Questionbank';
import { CreateQuestionbankRequest } from '../types/CreateQuestionbankRequest';
import Axios from 'axios'
import { UpdateQuestionbankRequest } from '../types/UpdateQuestionbankRequest';

export async function getQuestionbanks(idToken: string): Promise<Questionbank[]> {
  console.log('Fetching questionbanks')

  const response = await Axios.get(`${apiEndpoint}/questionbanks`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Questionbanks:', response.data)
  return response.data.items
}

export async function createQuestionbank(
  idToken: string,
  newQuestionbank: CreateQuestionbankRequest
): Promise<Questionbank> {
  const response = await Axios.post(`${apiEndpoint}/questionbanks`,  JSON.stringify(newQuestionbank), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchQuestionbank(
  idToken: string,
  questionbankId: string,
  updatedQuestionbank: UpdateQuestionbankRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/questionbanks/${questionbankId}`, JSON.stringify(updatedQuestionbank), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteQuestionbank(
  idToken: string,
  questionbankId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/questionbanks/${questionbankId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  questionbankId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/questionbanks/${questionbankId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
