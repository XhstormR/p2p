import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './service/error-handler.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideAnimationsAsync(),
        provideHttpClient(),
        { provide: ErrorHandler, useClass: ErrorHandlerService },
    ],
};
