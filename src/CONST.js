import { join } from 'path';
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';

export const DEFAULT_CONFIG =
  safeLoad(
    readFileSync(
      join(__dirname, '..', 'assets', 'playground.yml'),
      'utf8'
    )
  );
