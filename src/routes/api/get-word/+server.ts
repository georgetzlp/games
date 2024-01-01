import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const length = (url.searchParams.get('length') ?? '5') as `${number}`;

  if (!/^\d+$/.test(length)) throw error(400, `Invalid length: ${length}`);

  const words = await import('./words_alpha.min.json', { with: { type: 'json' } })
    .catch((e) => {
      throw error(500, e);
    })
    .then(r => r.default as Record<`${number}`, string[]>)
    .then(r => r[length]!);

  const date = new Date();
  const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;

  const sin = Math.sin(dayOfYear) * 10000;
  const rand = sin - Math.floor(sin);

  if (!words || words.length === 0) throw error(501, `No words of length ${length} found`);

  const word = words[Math.floor(rand * words.length)]!;

  return json({
    word,
    message: 'nooo you weren\'t supposed to look at this :(((((',
  });
}
