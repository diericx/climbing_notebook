import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
  return json({
    serverString: 'Your random number is: ' + Math.random()
  });
}
