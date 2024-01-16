import { error } from '@sveltejs/kit';


export async function getWord(length = 5) {
  const words = await import('./words_alpha.min.json', { with: { type: 'json' } })
    .catch((e) => {
      throw error(500, e);
    })
    .then(r => r.default as Record<`${number}`, string[]>)
    .then(r => r[`${length}`]!);

  if (!words || words.length === 0) throw error(404, 'No words found');

  const date = new Date();
  const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;

  const sin = Math.sin(dayOfYear) * 10000;
  const rand = sin - Math.floor(sin);

  const word = words[Math.floor(rand * words.length)]!;

  return word;
}
