export function workify<T>(callback: () => T) {
  const code = callback.toString();
  const blob = new Blob(
    [`onmessage = function(e) { postMessage((${code})(e.data)) }`],
    { type: "text/javascript" },
  );
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  return async () => {
    return new Promise<T>((resolve, reject) => {
      worker.addEventListener("message", (event) => {
        resolve(event.data as T);
      });

      worker.addEventListener("error", reject);
    });
  };
}
