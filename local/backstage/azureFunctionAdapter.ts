import { HTTPMethod } from "@azure/cosmos";
import { AzureFunction, BindingDefinition, Context, ContextBindingData, ContextBindings, ExecutionContext, HttpRequest, Logger, TraceContext } from "@azure/functions";
import { Request, Response } from "express";

export type AzureFunctionHeaders = { [key:string]: string }

export type FunctionResponse = { [key: string]: any; } | undefined

export class AzureFunctionAdapter {
  context: FakeAzureFunctionContext;

  constructor(private func: AzureFunction) {
    this.context = new FakeAzureFunctionContext()
  }

  async run(req: Request, res: Response): Promise<void> {
    const functionRequest = this.normalizeRequest(req)
    
    await this.func(this.context, functionRequest)

    const functionResponse = this.context.res
    const body = functionResponse?.body ?? ""
    const status = functionResponse?.status ?? 200
    const headers = functionResponse?.headers ?? {}

    res.status(status).set(headers).send(body)
  }

  private normalizeRequest(req: Request): HttpRequest {
    let headers: { [name: string]: string } = {}
    for (let i = 0; i < req.rawHeaders.length; i = i + 2) {
      headers[req.rawHeaders[i].toLowerCase()] = req.rawHeaders[i + 1]
    }
  
    return {
      method: (req.method ?? null) as HTTPMethod | null,
      url: req.url ?? "",
      query: {},
      headers,
      params: {},
      body: req.body,
      rawBody: req.body
    }
  }
}

class FakeAzureFunctionContext implements Context {
  invocationId: string;
  executionContext: ExecutionContext;
  bindings: ContextBindings;
  bindingData: ContextBindingData;
  traceContext: TraceContext;
  bindingDefinitions: BindingDefinition[];
  log: Logger;
  req?: HttpRequest | undefined;
  res?: { [key: string]: any; } | undefined;

  constructor() {
    this.invocationId = "fake-invocation-id"
    this.executionContext = {} as any
    this.bindings = {}
    this.bindingData = {} as any
    this.traceContext = {} as any
    this.bindingDefinitions = []
    this.log = (() => {}) as any
  }

  done(): void {
    throw new Error("Method not implemented.");
  }
}
