import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const sesClient = new SESClient({ region: 'us-west-2' });

const createSendEmailCommand = (
  toAddress: string,
  htmlBodyData: string,
  fromAddress = 'noreply@climbingnotebook.com',
) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBodyData,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'ClimbingNotebook Password Reset',
      },
    },
    Source: fromAddress,
  });
};

export { createSendEmailCommand, sesClient };
