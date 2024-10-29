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
		},
		include: {
			topics: true
		}
	});

	if (!userDetails) {
		redirect(302, '/initial');
	}

	const googleAccount = await prisma.account.findFirst({
		where: {
			providerId: 'google',
			userId: session.user.id
		}
	});

	return {
		session: session,
		userDetails: userDetails,
		hasLinkedGoogle: !!googleAccount
	};
}) satisfies LayoutServerLoad;
