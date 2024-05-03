import { Signal } from "@angular/core";
import { Observable } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { copyOf } from "./utils";

declare module "rxjs" {
    interface Observable<T> {
        _toSignal(this: Observable<T>): Signal<T | undefined>;
    }
}

declare global {
    interface Object {
        _copy<T>(this: T, partial: Partial<T>): T;
    }
}

Object.defineProperty(Observable.prototype, "_toSignal", {
    value: function <T>(this: Observable<T>): Signal<T | undefined> {
        return toSignal(this);
    },
});

Object.defineProperty(Object.prototype, "_copy", {
    value: function <T>(this: T, partial: Partial<T>): T {
        return copyOf(this, partial);
    },
});
