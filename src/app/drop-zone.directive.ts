import { Directive, model } from '@angular/core';

@Directive({
    selector: '[appDropZone]',
    standalone: true,
    host: {
        '[class.drop-zone]': 'enabled()',
        '(drop)': 'onDrop($event)',
        '(dragover)': 'onDragOver()',
        '(dragleave)': 'onDragLeave()',
    },
})
export class DropZoneDirective {
    enabled = model(false);
    fileDrop = model<Array<File>>([]);

    onDrop(event: DragEvent) {
        this.enabled.set(false);

        let dataTransfer = event.dataTransfer;
        if (dataTransfer && dataTransfer.files.length > 0) {
            let files = Array.from(dataTransfer.files);
            this.fileDrop.set(files);
        }

        return false;
    }

    onDragOver() {
        this.enabled.set(true);
        return false;
    }

    onDragLeave() {
        this.enabled.set(false);
        return false;
    }
}
