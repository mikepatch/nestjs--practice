import { Injectable, NestMiddleware } from '@nestjs/common';
import acceptLanguage from 'accept-language';

acceptLanguage.languages(['pl-PL', 'en-US']);

@Injectable()
export class LanguageExtractorMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const acceptLanguageHeader = req.headers['accept-language'] || '';
    req['language'] = acceptLanguage.get(acceptLanguageHeader);
    next();
  }
}
