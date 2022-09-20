import { Action } from "redux"

export interface Procedure<V, S> {
  reducer: ReducerFunction<V, S> | undefined
  next: ((dispatcher: DispatcherFunction, value: V) => void) | undefined
  register(registerMessage: RegistrationFunction<V, S>): void
}

export interface ProcedureBuilder<V, S> extends Procedure<V, S> {
  updateView(reducer: ReducerFunction<V, S>): ProcedureBuilder<V, S>
  andThen<R>(generator: (value: V) => Promise<R>): ProcedureBuilder<R, S>
}

export type ProcedureMessage = Action<string>

export type ReducerFunction<T, S> = (state: S, value: T) => void
export type DispatcherFunction = (message: ProcedureMessage) => void
export type RegistrationFunction<V, S> = (messageType: string, procedure: Procedure<V, S>) => void

class MessageProcedure<V extends ProcedureMessage, S> implements ProcedureBuilder<V, S> {
  public reducer: ReducerFunction<V, S> | undefined = undefined
  public next: ((dispatcher: DispatcherFunction, value: V) => void) | undefined = undefined

  constructor(private messageType: V["type"]) { }

  updateView(reducer: ReducerFunction<V, S>): ProcedureBuilder<V, S> {
    this.reducer = reducer
    return this
  }

  andThen<R>(generator: (value: V) => Promise<R>): ProcedureBuilder<R, S> {
    return new NextProcedure(this, generator)
  }

  register(register: RegistrationFunction<V, S>): void {
    register(this.messageType, this)
  }
}

class NextProcedure<V, S> implements ProcedureBuilder<V, S> {
  public reducer: ReducerFunction<V, S> | undefined = undefined
  public next: ((dispatcher: DispatcherFunction, value: V) => void) | undefined = undefined

  constructor(private parent: ProcedureBuilder<any, S>, private valueGenerator: (message: any) => Promise<V>) {
    this.parent.next = async (dispatcher, value) => {
      const nextValue = await this.valueGenerator(value)
      if (this.reducer) {
        dispatcher(reducerMessage(nextValue, this.reducer))
      }
    }
  }

  updateView(reducer: ReducerFunction<V, S>): ProcedureBuilder<V, S> {
    this.reducer = reducer
    return this
  }

  andThen<R>(generator: (value: V) => Promise<R>): ProcedureBuilder<R, S> {
    return new NextProcedure(this, generator)
  }

  register(registerMessage: RegistrationFunction<V, S>): void {
    this.parent.register(registerMessage)
  }
}

export function receiveMessage<V extends ProcedureMessage, S>(messageType: V["type"]): MessageProcedure <V, S> {
  return new MessageProcedure(messageType)
}

export function mapProcedureState<V, S, R>(mapper: (state: R) => S, procedure: Procedure<V, S>): Procedure<V, R> {
  return {
    reducer: (state: R, value: V) => {
      procedure.reducer?.(mapper(state), value)
    },
    next: procedure.next,
    register: (registerMessage: RegistrationFunction<V, R>) => {
      procedure.register((messageType: string, procedure: Procedure<V, S>) => {
        registerMessage(messageType, mapProcedureState(mapper, procedure))
      })
    }
  }
}

export interface ReducerMessage<M, S> {
  type: "__update-view"
  payload: M
  reducer: (state: S, message: M) => void
}


export function reducerMessage<M, S>(message: M, reducer: ReducerFunction<M, S>): ReducerMessage<M, S> {
  return {
    type: "__update-view",
    payload: message,
    reducer
  }
}