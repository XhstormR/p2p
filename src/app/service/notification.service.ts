import { Injectable, NgZone } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    private alert = new Audio("assets/sounds/alert.m4a");

    constructor(
        private ngZone: NgZone,
        private snackBar: MatSnackBar,
    ) {
        this.alert.load();
    }

    public open(message: string, duration: number = 10_000) {
        this.ngZone.run(() => this.snackBar.open(message, "OK", { duration: duration }));
        this.alert
            .play()
            .then(() => (this.alert.muted = false))
            .catch(() => (this.alert.muted = true)); // fix play() can only be initiated by a user gesture error
    }

    public error(message: string, duration: number = 10_000) {
        this.open(`❗ ${message}`, duration);
    }
}
