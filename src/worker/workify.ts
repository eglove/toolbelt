export function workify<T>(callback: () => T, signal?: AbortSignal) {
  const code = callback.toString();
  const blob = new Blob(
    [`onmessage = function(e) { postMessage((${code})(e.data)) }`],
    { type: "text/javascript" },
  );
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  signal?.addEventListener("abort", () => {
    worker.terminate();
  });

  return async () => {
    return new Promise<T>((resolve, reject) => {
      worker.addEventListener("message", (event) => {
        resolve(event.data as T);
      });

      worker.addEventListener("error", reject);
      // eslint-disable-next-line unicorn/require-post-message-target-origin
      worker.postMessage("");
    });
  };
}
