type Success<T> = {
    success: T;
    failure?: never;
}

type Failure<U> = {
    success?: never;
    failure: U;
}

export type Result<T, U> = NonNullable<Success<T> | Failure<U>>

export type UnwrapResult = <T, U>(e: Result<T, U>) => NonNullable<T | U>;

export const unwrapResult: UnwrapResult = <T, U>({
  success,
  failure,
}: Result<T, U>) => {
  if (failure !== undefined && success !== undefined) {
    throw new Error(
      `Received both success and failure values at runtime when opening an Result\nSuccess: ${JSON.stringify(
        success
      )}\nFailure: ${JSON.stringify(failure)}`
    );
  }
  if (success !== undefined) {
    return success as NonNullable<T>; 
  }
  if (failure !== undefined) {
    return failure as NonNullable<U>;
  }
  throw new Error(
    `Received no left or right values at runtime when opening Either`
  );
};

export const isSuccess = <T, U>(e: Result<T, U>): e is Success<T> => {
  return e.success !== undefined;
};

export const isFailure = <T, U>(e: Result<T, U>): e is Failure<U> => {
  return e.failure !== undefined;
};

export const makeSuccess = <T>(value: T): Success<T> => ({ success: value });

export const makeFailure = <U>(value: U): Failure<U> => ({ failure: value });