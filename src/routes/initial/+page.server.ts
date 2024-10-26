import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {
        name: "John Doe",
        email: "john.doe@example.com",
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get("email");
        console.log(email);
    },
};