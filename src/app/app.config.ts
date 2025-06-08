import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from "@angular/core";
import { PreloadAllModules, provideRouter, withPreloading } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./service/error-handler.service";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideHttpClient(),
        { provide: ErrorHandler, useClass: ErrorHandlerService },
    ],
};
