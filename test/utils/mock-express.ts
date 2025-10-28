import { Request, Response } from "express";

export function makeMockRequest(
  body: any = {},
  params: any = {},
  query: any = {}
): Partial<Request> {
  return {
    body,
    params,
    query,
  };
}

export function makeMockResponse() {
  let statusCode = 0;
  let responseBody: any = null;

  const res = {
    status: (code: number) => {
      statusCode = code;
      return res;
    },
    json: (body: any) => {
      responseBody = body;
      return res;
    },
    send: (body: any) => {
      responseBody = body;
      return res;
    },
  };

  return {
    res: res as any as Response,
    getStatus: () => statusCode,
    getBody: () => responseBody,
  };
}
