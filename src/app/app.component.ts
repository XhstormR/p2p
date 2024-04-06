import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    constructor(sanitizer: DomSanitizer, iconRegistry: MatIconRegistry) {
        iconRegistry.addSvgIcon(
            'link',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/link.svg'),
        );
        iconRegistry.addSvgIcon(
            'autorenew',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/autorenew.svg'),
        );
        iconRegistry.addSvgIcon(
            'backspace',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/backspace.svg'),
        );
        iconRegistry.addSvgIcon(
            'content_copy',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/content_copy.svg'),
        );
        iconRegistry.addSvgIcon(
            'download',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/download.svg'),
        );
        iconRegistry.addSvgIcon(
            'attach_file',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/attach_file.svg'),
        );
    }
}
