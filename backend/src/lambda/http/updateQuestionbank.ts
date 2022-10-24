import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateQuestionbank } from '../../businessLogic/questionbanks'
import { UpdateQuestionbankRequest } from '../../requests/UpdateQuestionbankRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const questionbankId = event.pathParameters.questionbankId
    const updatedQuestionbank: UpdateQuestionbankRequest = JSON.parse(event.body)
    // Update a QUESTIONBANK item with the provided id using values in the "updatedQuestionbank" object

    const userId = getUserId(event);
    const updatedItem = await updateQuestionbank(
      {
        userId: userId,
        questionbankId: questionbankId,
        createdAt: new Date().toISOString(),
        done: updatedQuestionbank.done, //
        attachmentUrl: "http://example.com/image.png",
        dueDate: updatedQuestionbank.dueDate, //
        question: updatedQuestionbank.question //
      },
      questionbankId,
      userId
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: updatedItem
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
