import { Signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { defer, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

declare module 'rxjs' {
    interface Observable<T> {
        toSignal(): Signal<T>;
    }
}

Observable.prototype.toSignal = function (this) {
    return toSignal(this);
};

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function prepare<T>(callback: () => void) {
    return (source: Observable<T>) =>
        defer(() => {
            callback();
            return source;
        });
}

export function indicate<T>(indicator: WritableSignal<boolean>) {
    return (source: Observable<T>) =>
        source.pipe(
            prepare(() => indicator.set(true)),
            finalize(() => indicator.set(false)),
        );
}
