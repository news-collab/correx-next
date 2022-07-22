import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		},
	},
	plugins: [sveltekit()]
};

export default config;
