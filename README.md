TypeScript utilities with a consistent, functional (and forced) error handling interface 
inspired by GoLang and Zod.

## The Key is the Error Handling

Any utility that may throw and error uses a simple return type:

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
With TypeScript, this forces you to check the value of `isSuccess` before TS knows which other property exists on the object.

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

### Functional Try/Catch

```ts
const result = tryCatch(() => {
    return 'maybe throws';
});

if (result.isSuccess) {
    console.info(result.data);
} else {
    console.error(result.error);
}

const asyncResult = await tryCatchAsync(async () => {
    return 'maybe throws';
});

if (asyncResult.isSuccess) {
    console.info(asyncResult.data);
} else {
    console.error(asyncResult.error);
}
```

### betterNumber

Handle numbers safely, worry not about NaN! Includes internationalization and conversion.

```ts
// Accepts big int and strings
import {betterNumber} from "./number";

betterNumber(123)
betterNumber('123')
betterNumber(BigInt(123))
betterNumber('12345678901234567890') // BigInt

// locale formatting, is locale is not provided, it will attempt to default to your browser
const englishUs = betterNumber(1000, 'en-US', {
    style: 'unit',
    unit: 'inch',
});
englishUs.number // 1000
englishUs.locale // en-US
englishUs.format() // 1,000 in

const portugueseBrazil = betterNumber(1000, 'pt-BR', {
    style: 'unit',
    unit: 'inch',
});
englishUs.number // 1000
englishUs.locale // pt-BR
englishUs.format() // 1.000 pol.

// Invalid numbers return as undefined, not NaN!
betterNumber(undefined).number // undefined
betterNumber(null).number // undefined
```

### Object Merge

Type safe object merge!

```ts
const target = {
  a: 20,
  b: null,
  c: { from: 30, to: 60 },
  d: [1, 2],
};

const source = {
  a: 10,
  b: undefined,
  c: { from: 50 },
  d: [3],
};

// Arrays will be merged rather than replaced
const isMergingArrays = true
const result = merge(target, isMergingArrays, source)

// {
//   a: 10,
//   b: undefined,
//   c: { from: 50, to: 60 },
//   d: [1, 2, 3],
// }

const object1 = { a: 1, b: { x: 10, y: 20 }, c: [1, 2, 3] };
const object2 = { a: 2, b: { x: 15, z: 30 }, d: 'string1' };
const object3 = { a: 3, b: { y: 25, z: 35 }, e: { f: 'string2' } };
const object4 = {
    a: 4,
    b: { x: 20, y: 30, z: 40 },
    c: [4, 5, 6],
    e: { g: 'string3' },
};

// Arrays under the same key will be replaced
const result2 = merge(object1, false, object2, object3, object4);

// {
//   a: 4,
//   b: { x: 20, y: 30, z: 40 },
//   c: [4, 5, 6],
//   d: 'string1',
//   e: { f: 'string2', g: 'string3' },
// }
```

### HTTP_STATUS constant

```ts
import { HTTP_STATUS } from '@ethang/toolbelt/constants/http';

const { OK, INTERNAL_SERVER_ERROR, IM_A_TEAPOT, ... } = HTTP_STATUS;
```

### Parse JSON bodies

Parse JSON from Request and Response bodies with Zod schemas.

```ts
const requestBody = await parseFetchJson(
    new Request('http://example.com', {
        body: JSON.stringify({ value: 'hello' }),
    }),
    z.object({ value: z.string() }),
);

const responseBody = await parseFetchJson(
    new Response(JSON.stringify({ value: 'hello' })),
    z.object({ value: z.string() }),
);
```

### Parse JSON strings

```ts
const json = parseJson('{"hello": "world"}', z.object({ hello: z.string() }));
```

### Promise.AllSettled with keys

```ts
const results = await promiseAllSettled({
    first: fetch('http://example.com/todo/1'),
    second: fetch('http://example.com/todo/2'),
    third: fetch('http://example.com/todo/3'),
});

const { first, second, third } = results;
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
        pathVariables: { id },
        searchParams: { filter: 'name', orderBy: 'date' },
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
isEmpty({ hello: 'world' }) // false
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
