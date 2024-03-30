TypeScript utilities with error handling that is consistent, forced, and functional.

Test Report: https://toolbelt.pages.dev/

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

