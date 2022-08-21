export interface ResultHandler<T, E> {
  ok: (value: T) => { type: string }
  error: (value: E) => { type: string }
}

export interface Result<T, E> {
  resolve: (handler: ResultHandler<T, E>) => { type: string }
}

export function okResult<T, E>(value: T): Result<T, E> {
  return {
    resolve(handler) {
      return handler.ok(value)
    }
  }
}

export function errorResult<T, E>(error: E): Result<T, E> {
  return {
    resolve(handler) {
      return handler.error(error)
    }
  }
}