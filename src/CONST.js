import { safeLoad } from 'js-yaml';
import { readAssetSync } from './util/FileUtil';

export const DEFAULT_CONFIG = safeLoad(readAssetSync('playground.yml'));
