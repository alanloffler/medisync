export interface IEmailData {
  to: string[];
  subject: string;
  body: string;
  attachments?: IEmailAttachment[];
}

export interface IEmailAttachment {
  filename: string;
  path: string;
}
