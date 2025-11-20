import {
    ApplicationConfig,
    ErrorHandler,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from "@angular/core";
import { PreloadAllModules, provideRouter, withPreloading } from "@angular/router";
import { routes } from "./app.routes";
import { GlobalErrorHandler } from "./service/error-handler.service";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withPreloading(PreloadAllModules)),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ],
};
