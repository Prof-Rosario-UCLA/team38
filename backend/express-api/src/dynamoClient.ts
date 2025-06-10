import {
    DynamoDBClient,
  } from '@aws-sdk/client-dynamodb';
  import {
    DynamoDBDocumentClient,
  } from '@aws-sdk/lib-dynamodb';
  import dotenv from 'dotenv';
import path from 'path';
  
  dotenv.config({
    path: path.resolve(__dirname, "../.env"),
  });
    
  const isLocal = !!process.env.DYNAMO_ENDPOINT;

  const ddb = new DynamoDBClient({
  region: process.env.AWS_REGION ?? "us-west-1",
    ...(isLocal && {                     
      endpoint: process.env.DYNAMO_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    }),
  });
  
  export const ddbDocClient = DynamoDBDocumentClient.from(ddb, {
    marshallOptions: { convertEmptyValues: true, removeUndefinedValues: true },
    unmarshallOptions: { wrapNumbers: false },
  });