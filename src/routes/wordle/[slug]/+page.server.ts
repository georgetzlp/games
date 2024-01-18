import { error } from '@sveltejs/kit';
import { getWord } from '$lib/server/get-word';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const result = await getWord(parseInt(params.slug));

  if (!result) throw error(404, 'Word not found');

  return {
    word: result,
  };
}
