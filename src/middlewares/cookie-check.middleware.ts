import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CookieCheckMiddleware implements NestMiddleware {
  private logger = new Logger(CookieCheckMiddleware.name);

  use(req: any, res: any, next: () => void) {
    this.logger.debug(
      `Checking if cookie set for request. Client language: ${req['language']}`,
    );
    const [cookieEntry] = req.headers['set-cookie'] || [];

    if (cookieEntry) {
      this.logger.warn(`Got cookie: ${cookieEntry}`);
    }

    next();
  }
}
