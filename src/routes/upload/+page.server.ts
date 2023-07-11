import { redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';

export async function load(event) {
	let session = event.cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	if (user.status !== 200) {
		throw redirect(302, `/login`);
	}
}
