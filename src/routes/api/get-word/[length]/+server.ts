import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const GET: RequestHandler = async ({ params }) => {
  const words = await readFile(join(__dirname, '../words_alpha.txt'), 'utf8')
    .catch(() => error(500, 'Failed to read word list'))
    .then(contents => contents.split('\r\n'))
    .then(array => array.filter((word) => word.length === Number(params.length ?? 5)));

  const result = words[Math.floor(Math.random() * words.length)]!;

  return new Response(result, { status: 200 });
};
