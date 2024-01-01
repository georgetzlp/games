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

  const word = words[Math.floor(Math.random() * words.length)]!;

  return json({ word });
}
