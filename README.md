TypeScript utilities with error handling that is consistent, forced, and functional.

## The Key is the Error Handling

Any utility that may throw an error uses a simple return type:

```ts
type HandledError<T, E> =
    | { data: T; isSuccess: true }
    | { error: E; isSuccess: false };
```

If you're familiar with Zod, you may be familiar with the return of [.safeParse()](https://zod.dev/?id=safeparse).

```ts
stringSchema.safeParse(12);
// => { success: false; error: ZodError }
```

With TypeScript, this forces you to check the value of `isSuccess` before TS knows which other property exists on the
object.

```ts
const result: HandledError<string, Error> = foo();

result.data // This is a type error!
result.error // Also a type error!

if (!result.isSuccess) {
    result.data // Type error!
    console.error(error.message); // TS knows this is an Error Type!
}

const value = result.data; // Value type is string!
```

## Looking for docs? Read the tests!

| Name                                                             | Description                                                                                          | 
|------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| [tryCatch / tryCatchAsync](./tests/functional/try-catch.test.ts) | Handle sync and async function errors functionally. Get rid of the try/catch bloat!                  |
| [fetcher](./tests/fetch/fetcher.test.ts)                         | fetch wrapper that works with Cache API and IndexedDB to cache Request/Response pairs on an interval |
| [urlBuilder](./tests/fetch/url-builder.test.ts)                  | Build URLs with Zod schema and simple objects for search params and path variables                   |
| [API](./tests/api/api.test.ts)                                   | Centralize API calls. Built on top of urlBuilder                                                     |
| [betterNumber](./tests/number/number.test.ts)                    | Handle numbers safely, worry not about NaN! Includes internationalization and conversion.            |
| [promiseAllSettled](./tests/fetch/promise.test.ts)               | TypeSafe promise.allSettled with a key/value return                                                  |
| [promiseAll](./tests/fetch/promise.test.ts)                      | TypeSafe promise.all with a key/value return                                                         |
| [parseFetchJson](./tests/fetch/json.test.ts)                     | Parse Request and Response bodies with Zod schema                                                    |
| [parseJson](./tests/json/json.test.ts)                           | Synchronously parse JSON string with Zod schema                                                      |
| [merge](./tests/object/merge.test.ts)                            | Type safe object merge!                                                                              |
| [getCookieValue](./tests/http/cookie.test.ts)                    | Get cookie value from a string (document.cookie) or a Header object                                  |
| [HTTP_STATUS](./src/constants/http.ts)                           | Simple constants for HTTP statuses                                                                   |
| [isBigIntOrNumber](./tests/is/big-int-or-number.test.ts)         | Converts strings and tests for NaN's                                                                 |
| [isEmpty](./tests/is/empty.test.ts)                              | Tests for empty strings, arrays, object, Maps, Sets and Buffers                                      |
| [isNil](./tests/is/nil.test.ts)                                  | Why do we have both a null and undefined? Just check if it's nil!                                    |
| [isObject](./tests/is/object.test.ts)                            | Arrays, Objects, Maps, Sets, it's all objects!                                                       |
| [isString](./tests/is/string.test.ts)                            | Because it turns out `new String('string')` is not a sring.                                          |
