import { handleServerSession } from "@lucia-auth/sveltekit";

// Listen for change in sessions, sync sessions across tabs, 
// and set a local client cache of the user. 
// Since this also sets a context, it is required for other 
// client side functions to work
export const load = handleServerSession();
