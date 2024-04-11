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
    private icons = [
        { iconName: 'link', url: '/assets/svg/link.svg' },
        { iconName: 'autorenew', url: '/assets/svg/autorenew.svg' },
        { iconName: 'backspace', url: '/assets/svg/backspace.svg' },
        { iconName: 'content_copy', url: '/assets/svg/content_copy.svg' },
        { iconName: 'download', url: '/assets/svg/download.svg' },
        { iconName: 'attach_file', url: '/assets/svg/attach_file.svg' },
        { iconName: 'error', url: '/assets/svg/error.svg' },
    ];

    constructor(sanitizer: DomSanitizer, iconRegistry: MatIconRegistry) {
        this.icons.forEach(icon =>
            iconRegistry.addSvgIcon(icon.iconName, sanitizer.bypassSecurityTrustResourceUrl(icon.url)),
        );
    }
}
