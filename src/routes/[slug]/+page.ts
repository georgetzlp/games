import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  return await fetch(`/api/get-word?length=${params.slug}`).then(r => r.json());
}
