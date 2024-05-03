import { Injectable, NgZone } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    constructor(
        private ngZone: NgZone,
        private snackBar: MatSnackBar,
    ) {}

    public open(message: string, duration: number = 10_000) {
        this.ngZone.run(() => this.snackBar.open(message, "OK", { duration: duration }));
    }

    public error(message: string, duration: number = 10_000) {
        this.open(`❗ ${message}`, duration);
    }
}
