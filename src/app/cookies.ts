import * as electron from 'electron';
import { logger } from '../common/logger';

export const handleCookies = (): void => {
  const cookies = electron.session.defaultSession.cookies;
  cookies.on('changed', async (_event, cookie, _cause, removed) => {
    if (cookie.session && !removed) {
      const url = `${cookie.secure ? 'https' : 'http'}://${cookie.domain}${
        cookie.path
      }`;
      try {
        logger.info(
          `Trying to persist cookie ${JSON.stringify(cookie)} for ${url}`,
        );
        await cookies.set({
          url,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          expirationDate: Math.floor(new Date().getTime() / 1000) + 1209600,
        });
      } catch (e) {
        logger.error(
          `Failed to persist cookies due to -> ${JSON.stringify(e)}`,
        );
      }
    }
  });
};
