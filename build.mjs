import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

await esbuild.build({
  entryPoints: [path.join(__dirname, 'src/main.tsx')],
  bundle: true,
  outfile: path.join(__dirname, 'dist/assets/index.js'),
  minify: false,
  sourcemap: false,
  target: ['es2020'],
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.css': 'css',
    '.svg': 'dataurl',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  external: [],
  logLevel: 'info',
});

console.log('Build complete!');
