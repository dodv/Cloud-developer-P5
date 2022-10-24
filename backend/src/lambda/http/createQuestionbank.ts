import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateQuestionbankRequest } from '../../requests/CreateQuestionbankRequest'
import { getUserId } from '../utils';
import { createQuestionbank } from '../../businessLogic/questionbanks'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newQuestionbank: CreateQuestionbankRequest = JSON.parse(event.body)
    // Implement creating a new QUESTIONBANK item

    const userId = getUserId(event);
    const newItem = await createQuestionbank( userId, newQuestionbank.dueDate, newQuestionbank.question);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
