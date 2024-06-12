import { error } from '@sveltejs/kit';
import { getWord, getWords } from '$lib/server/wordle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const length = parseInt(params.slug);

  return {
    word: await getWord(length)
      .catch((e) => {
        if (e instanceof Error) {
          if (e.message === 'No words found') throw error(404, e.message);

          throw error(500, e.message);
        }

        throw error(500, e);
      }),

    validWords: undefined,
  };
};
