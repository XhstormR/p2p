import { Directive, output } from "@angular/core";

@Directive({
    selector: "[appPasteZone]",
    standalone: true,
    host: {
        "(paste)": "onPaste($event)",
    },
})
export class PasteZoneDirective {
    onFilePaste = output<Array<File>>();

    onPaste(event: ClipboardEvent) {
        let dataTransfer = event.clipboardData;
        if (dataTransfer && dataTransfer.files.length > 0) {
            let files = Array.from(dataTransfer.files);
            this.onFilePaste.emit(files);
        }
    }
}
