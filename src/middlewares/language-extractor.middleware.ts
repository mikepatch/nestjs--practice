import { Injectable, NestMiddleware } from '@nestjs/common';
import acceptLanguage from 'accept-language';
import { LanguageService } from '../shared/language/language.service';

// acceptLanguage.languages(['en-US', 'pl-PL']);

@Injectable()
export class LanguageExtractorMiddleware implements NestMiddleware {
  constructor(languageService: LanguageService) {
    acceptLanguage.languages(
      languageService.supportedLanguages() as unknown as string[],
    );
  }

  use(req: any, res: any, next: () => void) {
    req['language'] = acceptLanguage.get(req.headers['accept-language']);
    next();
  }
}
