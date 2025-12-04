interface IRequest {
  url: string;
  method: string;
  payload: Record<string, unknown>;
}

class Request implements IRequest {
  url: string = '';
  method: string = '';
  payload: Record<string, unknown> = {};
}

class RequestBuilder {
  private request: Request;

  constructor() {
    this.request = new Request();
  }

  forUrl(url: string): this {
    this. request.url = url;
    return this;
  }

  useMethod(method: string): this {
    this.request.method = method;
    return this;
  }

  setPayload(payload: Record<string, unknown>): this {
    this.request. payload = payload;
    return this;
  }

  build(): Request {
    return this.request;
  }
}

export default RequestBuilder;
