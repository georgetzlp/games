import { getWord } from '$lib/server/get-word';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    word: await getWord(),
  };
}
