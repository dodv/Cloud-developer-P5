import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { QuestionbankItem } from '../models/QuestionbankItem'
import { QuestionbankUpdate } from '../models/QuestionbankUpdate'
import { AttachmentUtils } from './attachmentUtils'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('QuestionbanksAccess')

// Implement the dataLayer logic

export class QuestionbanksAccess {
  constructor(
    private docClient: DocumentClient = createDynamoDBClient(),
    private attachementCtrl : AttachmentUtils = new AttachmentUtils(),
    private questionbanksTable = process.env.QUESTIONBANKS_TABLE
  ) {}

  async persistQuestionbank(questionbankItem: QuestionbankItem) {
    logger.info('Creating a new questionbank item : ', questionbankItem)

    await this.docClient
      .put({
        TableName: this.questionbanksTable,
        Item: questionbankItem
      })
      .promise()
    return questionbankItem;
  }

  async getAllQuestionbanks(userId: string) {
    logger.info('Getting all questionbanks for user : ', userId)
    const res = await this.docClient
      .query({
        TableName: this.questionbanksTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      })
      .promise()
    return res.Items as QuestionbankItem[]
  }

  async updateQuestionbank(questionbankId: string, userId: string, questionbankUpdate: QuestionbankUpdate) {
    logger.info('Updating questionbank item : ', { questionbankId, userId })
    return await this.docClient
      .update(
        {
          TableName: this.questionbanksTable,
          Key: { userId, questionbankId },
          ExpressionAttributeNames: { '#N': 'question' },
          UpdateExpression: 'set #N=:questionbankQuestion, dueDate=:dueDate, done=:done',
          ExpressionAttributeValues: {
            ':questionbankQuestion': questionbankUpdate.question,
            ':dueDate': questionbankUpdate.dueDate,
            ':done': questionbankUpdate.done
          },
          ReturnValues: 'UPDATED_NEW'
        },
        function (err, data) {
          if (err) {
            const error = JSON.stringify(err, null, 2)
            logger.error('=> Unable to update item. Error JSON:', error)
          } else {
            const updatedItem = JSON.stringify(data, null, 2)
            logger.info('=> Successfully updated questionbank:', updatedItem)
          }
        }
      )
      .promise()
  }

  async deleteQuestionbank(questionbankId: string, userId: string) {
    logger.info('Deleting questionbank item : ', { questionbankId, userId })
    return await this.docClient
      .delete({
        TableName: this.questionbanksTable,
        Key: { userId, questionbankId }
      })
      .promise()
  }

  async updateAttachmentUrl(
    questionbankId: string,
    userId: string
  ) {
    const UploadUrl = await this.attachementCtrl.getUploadUrl(questionbankId);
    const attachementUrl = await this.attachementCtrl.getAttachmentUrl(questionbankId);
    await this.docClient
      .update(
        {
          TableName: this.questionbanksTable,
          Key: { userId, questionbankId },
          UpdateExpression: 'set attachmentUrl=:attachmentUrl',
          ExpressionAttributeValues: {
            ':attachmentUrl': attachementUrl
          },
          ReturnValues: 'UPDATED_NEW'
        },
        function (err, data) {
          if (err) {
            const error = JSON.stringify(err, null, 2)
            logger.error('=> Unable to update item. Error JSON:', error)
          } else {
            const updatedItem = JSON.stringify(data, null, 2)
            logger.info('=> Successfully updated questionbank:', updatedItem)
          }
        }
      )
      .promise()
      return UploadUrl;
  }
}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}