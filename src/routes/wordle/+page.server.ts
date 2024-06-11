import { getWord, getWords } from '$lib/server/wordle';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    word: await getWord()
      .catch((e) => {
        if (e instanceof Error) {
          if (e.message === 'No words found') throw error(404, e.message);

          throw error(500, e.message);
        }

        throw error(500, e);
      }),

    validWords: await getWords()
      .catch((e) => {
        if (e instanceof Error) {
          if (e.message === 'No words found') throw error(404, e.message);

          throw error(500, e.message);
        }

        throw error(500, e);
      }),
  };
};
