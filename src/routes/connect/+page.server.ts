import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		page: 'connect'
	};
}) satisfies PageServerLoad;
