import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import AutoImport from 'unplugin-auto-import/vite';
import Pages from 'vite-plugin-pages';
import svgr from 'vite-plugin-svgr';

import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 8088,
		// proxy: {
		// 	'/tmap': {
		// 		target: 'https://apis.openapi.sk.com',
		// 		changeOrigin: true,
		// 		// rewrite: path => path.replace(/^\/map/, ''),
		// 	},
		// },
	},
	// build: {
	//   rollupOptions: {
	//     treeshake: feslintrcalse
	//   }
	// },
	// optimizeDeps: {
	// 	include: [
	// 		'file-saver', 'dayjs', 'react-i18next', 'react-router'
	// 	]
	// },
	plugins: [
		react(),
		tsconfigPaths(),
		svgr({ exportAsDefault: true }),
		Pages({
			dirs: [
				{ dir: 'src/pages', baseRoute: '' },
				{ dir: 'src/publish', baseRoute: 'publish' },
			],
			// sync/async로 컴포넌트 import 방식 변경 가능
			// importMode(filepath, options) {
			// 	// console.log(filepath, options);
			// 	return 'sync';
			// },
		}),
		AutoImport({
			// targets to transform
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.md$/, // .md
			],
			// global imports to register
			imports: [
				// presets
				'react',
				{
					react: ['Suspense'],
				},
				'react-router-dom',
				'react-router',
				{
					'react-i18next': ['initReactI18next', 'useTranslation'],
				},
			],
			dts: './auto.d.ts',
			dirs: ['./src/util'],
			eslintrc: {
				enabled: true,
				filepath: './.eslintrc-auto.json',
				globalsPropValue: true,
			},
		}),
	],
	css: {
		preprocessorOptions: {
			less: {
				modifyVars: {
					'primary-color': '#605cff',
					'link-color': '#605cff',
					'border-radius-base': '4px',
					'font-family': 'NotoSansKR',
				},
				javascriptEnabled: true,
			},
		},
	},
});
