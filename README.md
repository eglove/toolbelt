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
| [urlBuilder](./tests/fetch/url-builder.test.ts)                  | Build URLs with Zod schema and simple objects for search params and path variables                   |
| [API](./tests/api/api.test.ts)                                   | Centralize API calls. Built on top of urlBuilder                                                     |
| [getRequestKeys](./tests/http/request.test.ts)                   | Array of unique keys for a request, perfect for React Query                                          |
| [get](./tests/get/get.test.ts)                                   | Safetly get object values                                                                            |
| [betterNumber](./tests/number/number.test.ts)                    | Handle numbers safely, worry not about NaN! Includes internationalization and conversion.            |
| [promiseAllSettled](./tests/fetch/promise.test.ts)               | TypeSafe promise.allSettled with a key/value return                                                  |
| [promiseAll](./tests/fetch/promise.test.ts)                      | TypeSafe promise.all with a key/value return                                                         |
| [parseFetchJson](./tests/fetch/json.test.ts)                     | Parse Request and Response bodies with Zod schema                                                    |
| [parseJson](./tests/json/json.test.ts)                           | Synchronously parse JSON string with Zod schema                                                      |
| [merge](./tests/object/merge.test.ts)                            | Type safe object merge!                                                                              |
| [getCookieValue](./tests/http/cookie.test.ts)                    | Get cookie value from a string (document.cookie) or a Header object                                  |
| [setCookieValue](./tests/http/cookie.test.ts)                    | Append Set-Cookie to Response Headers                                                                |
| [getAcceptLanguage](./tests/http/headers.test.ts)                | Parse and get Accept-Language Headers                                                                |
| [HTTP_STATUS](./src/constants/http.ts)                           | Simple constants for HTTP statuses                                                                   |
| [isBigIntOrNumber](./tests/is/big-int-or-number.test.ts)         | Converts strings and tests for NaN's                                                                 |
