import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  return await fetch('/api/get-word').then(r => r.json());
}
