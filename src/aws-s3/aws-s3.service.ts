import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import * as dotenv from 'dotenv';
import { reversedMimeTypes } from '../const/mimeTypes';
import { UploadDto } from './dto/upload.dto';

dotenv.config();
@Injectable()
export class AwsS3Service {
  s3 = new S3({
    region: process.env.REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
  });

  uploadFile(uploadDto: UploadDto): Promise<string> {
    const rawBytes = uuidv4();
    const { mimeType } = uploadDto;
    const fileName = `${rawBytes.toString()}.${reversedMimeTypes[mimeType]}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Expires: 60,
      ACL: 'public-read',
      ContentType: 'application/octet-stream',
    };

    return this.s3.getSignedUrlPromise('putObject', params);
  }
}
