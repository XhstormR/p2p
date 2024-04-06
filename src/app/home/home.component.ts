import { Component, model, NgZone } from '@angular/core';
import { WebRTCService } from '../service/webrtc.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { indicate } from '../utils';
import { PeerEventType } from '../enums';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    readonly localId = this.webRTCService.localId;
    readonly isOnline = this.webRTCService.isOnline;
    readonly isReloading = model(false);
    readonly isConnecting = model(false);
    readonly isXSmall = this.breakpointObserver
        .observe(Breakpoints.XSmall)
        .pipe(map(result => result.matches))
        .toSignal();
    readonly remoteIdForm = new FormGroup({
        remoteId: new FormControl('', this.remoteIdValidator()),
    });

    constructor(
        private router: Router,
        private ngZone: NgZone,
        private webRTCService: WebRTCService,
        private breakpointObserver: BreakpointObserver,
    ) {
        this.onRenew();

        webRTCService.getPeerEvent().subscribe({
            next: event => {
                if (event.type === PeerEventType.Connection) {
                    this.goToDashboard();
                }
            },
        });
    }

    onRenew() {
        this.webRTCService.renewPeer().pipe(indicate(this.isReloading)).subscribe();
    }

    onSubmit() {
        let remoteId = this.remoteIdForm.value.remoteId;
        if (!remoteId) return;

        this.webRTCService
            .connect(remoteId)
            .pipe(indicate(this.isConnecting))
            .subscribe({
                complete: () => this.goToDashboard(),
                error: err => {
                    throw err;
                },
            });
    }

    private goToDashboard() {
        this.ngZone.run(() => this.router.navigateByUrl('/dashboard', { skipLocationChange: true }));
    }

    private remoteIdValidator() {
        return (control: AbstractControl) => {
            const forbidden = control.value === this.localId();
            return forbidden ? { remoteId: { value: control.value } } : null;
        };
    }
}