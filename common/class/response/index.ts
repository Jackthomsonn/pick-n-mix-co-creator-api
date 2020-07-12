export class Response {
  fail(userMessage?: string, developerMessage?: string) {
    return { userMessage, developerMessage }
  }

  success(data: any) {
    return data;
  }
}
