import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma.server';

export const load: PageServerLoad = (async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		redirect(302, '/');
	}

	const userDetails = await prisma.userDetails.findFirst({
		where: {
			userId: session.user.id
		}
	});

	if (userDetails) {
		redirect(301, '/connect');
	}

	return {
		name: session?.user.name,
		email: session?.user.email
	};
}) satisfies PageServerLoad;

export const actions = {
	details: async ({ request }) => {
		try {
			const session = await auth.api.getSession({
				headers: request.headers
			});

			if (!session) {
				redirect(302, '/');
			}

			const formData = await request.formData();
			console.log(formData);
			await prisma.userDetails.create({
				data: {
					userId: session.user.id,
					nickname: formData.get('nickname') as string,
					age: parseInt(formData.get('age') as string),
					gender: formData.get('gender') as string,
					topics: {
						create: (formData.get('topics') as string).split(',').map((topic) => ({
							topic
						}))
					}
				}
			});
			redirect(301, '/connect');
		} catch (error) {
			console.error(error);
		}
	}
};
