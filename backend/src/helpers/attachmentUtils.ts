import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('AttachmentUtils')

// Implement the fileStogare logic
export class AttachmentUtils {
    constructor(
      private readonly s3 = createS3Bucket(),
      private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
      private readonly urlExpiration = +process.env.SIGNED_URL_EXPIRATION
    ) {}

    async getUploadUrl(questionbankId: string): Promise<string> {
      logger.info(`Getting upload url for questionbank with id ${questionbankId}`)
      return this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: questionbankId,
        Expires: this.urlExpiration
      })
    }
    
    getAttachmentUrl(questionbankId: string): string {
      logger.info(`Getting attachement url for questionbank with id ${questionbankId}`)
      return `https://${this.bucketName}.s3.amazonaws.com/${questionbankId}`
    }
  }

  
const createS3Bucket = () =>
new XAWS.S3({
  signatureVersion: 'v4'
})