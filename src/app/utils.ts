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

export function download(data: Blob | ArrayBuffer, fileType: string, fileName: string) {
    let blob = new Blob([data], { type: fileType || 'application/octet-stream' });
    let url = URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 500);
}

export function blobToDataUrl(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        let reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

export async function dataUrlToBlob(dataUrl: string) {
    let response = await fetch(dataUrl);
    return await response.blob();
}
