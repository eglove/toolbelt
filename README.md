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

| Name                                                         | Description                                                                               | 
|--------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| [Functional try/catch](./tests/functional/try-catch.test.ts) | Handle sync and async function errors functionally. Get rid of the try/catch bloat!       | 
| [betterNumber](./tests/number/number.test.ts)                | Handle numbers safely, worry not about NaN! Includes internationalization and conversion. |
| [Object Merge](./tests/object/merge.test.ts)                 | Type safe object merge!                                                                   |
| [HTTP_STATUS Constants](./src/constants/http.ts)             | Simple constants for HTTP statuses                                                        |

### Parse JSON bodies

Parse JSON from Request and Response bodies with Zod schemas.

```ts
const requestBody = await parseFetchJson(
    new Request('http://example.com', {
        body: JSON.stringify({value: 'hello'}),
    }),
    z.object({value: z.string()}),
);

const responseBody = await parseFetchJson(
    new Response(JSON.stringify({value: 'hello'})),
    z.object({value: z.string()}),
);
```

### Parse JSON strings

```ts
const json = parseJson('{"hello": "world"}', z.object({hello: z.string()}));
```

### Promise.AllSettled with keys

```ts
const results = await promiseAllSettled({
    first: fetch('http://example.com/todo/1'),
    second: fetch('http://example.com/todo/2'),
    third: fetch('http://example.com/todo/3'),
});

const {first, second, third} = results;
```

### fetcher with a cache interval

Will store a fetched response in Cache API.
cacheKey is the name of the cache for all requests.
To get a key for a specific request, use .getRequestKey().

```ts
const example = fetcher({
    cacheInterval: 60, // Seconds
    cacheKey: 'uniqueKey',
    request: new Request('http://example.com'),
});

const requestKey = example.getRequestKey();
const isExpired = await example.isExpired();

const response = await example.fetch();
```

### URL Builder

Simple way to build URL with pathVariable and searchParams objects.

```ts
const getTodo = (id: string) => {
    return urlBuilder('todo/:id', {
        pathVariables: {id},
        searchParams: {filter: 'name', orderBy: 'date'},
        urlBase: 'http://example.com/',
    });
};

const urlObject = getTodo('1').url;
const urlString = getTodo('1').toString();
```

### Cookie Getter

Reader either a string (such as from document.cookie) or a Header object to get a cookie value.

```ts
const clientToken = getCookieValue('token', document.cookie);

const headers = new Headers();
headers.append('Set-Cookie', 'token=123;');
const serverToken = getCookieValue('token', headers);
```

### isBigIntOrNumber

It's ok with strings!

```ts
isBigIntOrNumber('2') // true
isBigIntOrNumber(2) // true
isBigIntOrNumber(BigInt(123)) // true

isBigIntOrNumber(0 / 0) // false
isBigIntOrNumber('not a number') // false
isBigIntOrNumber(undefined) // false
isBigIntOrNumber(null) // false
```

### isBrowser

```ts
const isOnClient = isBrowser;
```

### isEmpty

```ts
isEmpty(undefined) // true
isEmpty(null) // true
isEmpty('') // true
isEmpty(' ') // true (will trim empty spaces!)
isEmpty([]) // true
isEmpty({}) // true
isEmpty(new Map()) // true
isEmpty(new Set()) // true
isEmpty(Buffer.from('')) // true

isEmpty('1') // false
isEmpty([1]) // false
isEmpty({hello: 'world'}) // false
isEmpty(new Map([['hello', 'world']])) // false
isEmpty(new Set(['hello', 'world'])) // false
isEmpty(Buffer.from('1')) // false
```

### isNil

```ts
isNil(undefined) // true
isNil(null) // true
```

### isObject

```ts
isObject([]) // true
isObject({}) // true
isObject(new Map()) // true
isObject(new Set()) // true
isObject(Buffer.from('')) // true
isObject(() => 'hello') // true

isObject(undefined) // false
isObject(null) // false
isObject(' ') // false
```

### isString

```ts
isString('hello') // true
isString(String('hello')) // true

// This value typeof is NOT string! 
// But we check for it properly in isString
isString(new String('hello')) // true
```
