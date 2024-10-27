import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/prisma.server';

export const load: LayoutServerLoad = (async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	console.log(session);

	if (!session) {
		redirect(302, '/');
	}

	const userDetails = await prisma.userDetails.findFirst({
		where: {
			userId: session.user.id
		}
	});

	if (!userDetails) {
		redirect(302, '/initial');
	}

	return {
		session: session
	};
}) satisfies LayoutServerLoad;
