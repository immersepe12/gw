/* Copies the live site stylesheets into the DS package so the converter can
   ship them verbatim. assets/css/ stays the single source of truth — never
   edit the copies. cfg.cssEntry must stay inside the package dir, hence this. */
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');

mkdirSync(join(here, 'styles'), { recursive: true });
mkdirSync(join(here, '..', 'ds-tokens', 'css'), { recursive: true });

copyFileSync(join(repo, 'assets/css/main.css'), join(here, 'styles/main.css'));
copyFileSync(join(repo, 'assets/css/tokens.css'), join(here, '..', 'ds-tokens', 'css', 'tokens.css'));
console.log('sync-css: copied main.css -> styles/, tokens.css -> ds-tokens/css/');
