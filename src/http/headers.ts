export function getAcceptLanguage(acceptLanguage: string) {
  const languages = acceptLanguage.split(',');

  return languages
    .map(lang => {
      const [name, q] = lang.split(';');
      const [language, country] = name.split('-');

      return {
        country,
        language,
        name: name.trim(),
        quality: q ? Number.parseFloat(q.split('=')[1]) : 1,
      };
    })
    .sort((a, b) => {
      return b.quality - a.quality;
    });
}
