import {
    DynamoDBClient,
  } from '@aws-sdk/client-dynamodb';
  import {
    DynamoDBDocumentClient,
  } from '@aws-sdk/lib-dynamodb';
  import dotenv from 'dotenv';
  
  dotenv.config();
  
  const ddb = new DynamoDBClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.DYNAMO_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  
  export const ddbDocClient = DynamoDBDocumentClient.from(ddb, {
    marshallOptions: { convertEmptyValues: true, removeUndefinedValues: true },
    unmarshallOptions: { wrapNumbers: false },
  });