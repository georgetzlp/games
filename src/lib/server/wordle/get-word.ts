export async function getWords(length = 5) {
  const words = await import('./words_alpha.min.json', { with: { type: 'json' } })
    .catch((e) => {
      throw new Error(e);
    })
    .then(r => r.default as Record<`${number}`, string[]>)
    .then(r => r[`${length}`]!);

  if (!words || words.length === 0) throw new Error('No words found');

  return words;
}

export async function getWord(length = 5) {
  const words = await getWords(length);

  const date = new Date();
  const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;

  const sin = Math.sin(dayOfYear) * 10000;
  const rand = sin - Math.floor(sin);

  const word = words[Math.floor(rand * words.length)]!;

  return word;
}
