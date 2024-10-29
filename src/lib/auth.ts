import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '$lib/prisma.server';

// const prismaAuth = new PrismaClient();

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: 'sqlite' }),
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		}
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['google']
		}
	}
});
