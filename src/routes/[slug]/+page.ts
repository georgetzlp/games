import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  if (
    params.slug === "26" ||
    params.slug === '30' ||
    parseInt(params.slug) > 31
  ) throw error(404, 'Word not found');

  return await fetch(`/api/get-word?length=${params.slug}`).then(r => r.json());
}
