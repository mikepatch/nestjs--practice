import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(async () => {
    service = new LanguageService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return languages: en, pl as supported by this project', () => {
    expect(service.supportedLanguages()).toEqual(['en', 'pl']);
  });
});
