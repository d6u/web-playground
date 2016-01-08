import {promisify} from 'bluebird';
import {findAPortNotInUse} from 'portscanner';

const findAPortNotInUseAsync = promisify(findAPortNotInUse);

export function getAvailablePort() {
  return findAPortNotInUseAsync(3000, 65535, '127.0.0.1');
}
