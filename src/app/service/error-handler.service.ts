import { ErrorHandler, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";

@Injectable({
    providedIn: "root",
})
export class ErrorHandlerService implements ErrorHandler {
    constructor(private notificationService: NotificationService) {}

    handleError(error: any) {
        if (error instanceof Error) this.notificationService.error(error.message);
        console.error("handleError", error);
    }
}
