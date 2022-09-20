export interface ResultResolver<T, E> {
  ok: (value: T) => { type: string }
  error: (value: E) => { type: string }
}

export interface ResultHandler<T, E> {
  ok: (value: T) => void
  error: (value: E) => void
}

export interface Result<T, E> {
  resolve: (handler: ResultResolver<T, E>) => { type: string }
  when: (handler: ResultHandler<T, E>) => void
}

export function okResult<T, E>(value: T): Result<T, E> {
  return {
    resolve(resolver) {
      return resolver.ok(value)
    },
    when(handler) {
      handler.ok(value)
    }
  }
}

export function errorResult<T, E>(error: E): Result<T, E> {
  return {
    resolve(resolver) {
      return resolver.error(error)
    },
    when(handler) {
      handler.error(error)
    }
  }
}