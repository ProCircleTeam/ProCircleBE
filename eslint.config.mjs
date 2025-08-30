import config from 'eslint-config-xo';
import {defineConfig} from 'eslint/config';

export default defineConfig([
	config,
	{
		files: ['**/*.js', '**/*.mjs'],
		languageOptions: {
			globals: {
				require: 'readonly',
				module: 'readonly',
				node: true,
			},
		},
		rules: {
			// Disable the rules that complain about trailing commas
			'jsonc/no-trailing-commas': 'off',

			// The `xo` config might also have other rules that conflict.
			// You may need to disable them here as well.
			// For example:
			// 'jsonc/no-dupe-keys': 'error', // if you want to keep this one
		},
	},
	{
		ignores: ['**/*.json'],
	},
]);
