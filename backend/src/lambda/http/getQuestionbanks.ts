import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getQuestionbanksForUser as getQuestionbanksForUser } from '../../businessLogic/questionbanks'
import { getUserId } from '../utils';

// Get all QUESTIONBANK items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here

    console.log("======> youba getQuestionbanks.ts handler() event: ", event);

    const questionbanks = await getQuestionbanksForUser(getUserId(event));
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: questionbanks
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
