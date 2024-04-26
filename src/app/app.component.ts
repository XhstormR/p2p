import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NoSleepService } from './service/no-sleep.service';
import { error } from './utils';

@Component({
    selector: 'app-root',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    private icons = [
        { iconName: 'link', url: 'assets/svg/link.svg' },
        { iconName: 'autorenew', url: 'assets/svg/autorenew.svg' },
        { iconName: 'backspace', url: 'assets/svg/backspace.svg' },
        { iconName: 'content_copy', url: 'assets/svg/content_copy.svg' },
        { iconName: 'download', url: 'assets/svg/download.svg' },
        { iconName: 'attach_file', url: 'assets/svg/attach_file.svg' },
        { iconName: 'error', url: 'assets/svg/error.svg' },
        { iconName: 'done', url: 'assets/svg/done.svg' },
        { iconName: 'menu', url: 'assets/svg/menu.svg' },
    ];

    constructor(
        private noSleepService: NoSleepService,
        sanitizer: DomSanitizer,
        iconRegistry: MatIconRegistry,
    ) {
        this.noSleepService.on().catch(err => {
            console.warn(err);
            error(`Request for wake lock failed: ${err}`);
        });

        this.icons.forEach(icon =>
            iconRegistry.addSvgIcon(icon.iconName, sanitizer.bypassSecurityTrustResourceUrl(icon.url)),
        );
    }
}
