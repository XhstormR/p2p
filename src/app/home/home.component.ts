import { ChangeDetectionStrategy, Component, effect, model, NgZone } from "@angular/core";
import { PeerService } from "../service/peer.service";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { error, indicate } from "../utils";
import { PeerEventType } from "../peer-event.model";
import { LocalStorageService } from "../service/local-storage.service";
import { LayoutService } from "../service/layout.service";
import { EventService } from "../service/event.service";
import { DomSanitizer } from "@angular/platform-browser";
import QRCode, { QRCodeToStringOptions } from "qrcode";

@Component({
    selector: "app-home",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent {
    readonly isReloading = model(false);
    readonly isConnecting = model(false);
    readonly qrcode = model();

    readonly mobilePattern = /android|ios|ipad|mobile/i;
    readonly isMobile = this.mobilePattern.test(navigator.userAgent);

    constructor(
        private router: Router,
        private ngZone: NgZone,
        private localStorageService: LocalStorageService,
        public layoutService: LayoutService,
        public peerService: PeerService,
        eventService: EventService,
        sanitizer: DomSanitizer,
        route: ActivatedRoute,
    ) {
        peerService.startPeerSession().pipe(indicate(this.isReloading)).subscribe();
        eventService.onEvent("PeerEvent").subscribe(event => {
            if (event.type === PeerEventType.onConnectionConnected) {
                this.localStorageService.setItem("remote-id", event.peer);
                this.goToDashboard();
            }
        });

        route.queryParams.subscribe(params => {
            if (params["remoteId"]) this.remoteIdForm.setValue({ remoteId: params["remoteId"] });
        });

        effect(() => {
            let url = `https://xhstormr.github.io/p2p?remoteId=${peerService.localId()}`;
            let opt: QRCodeToStringOptions = {
                type: "svg",
            };
            QRCode.toString(url, opt, (err, svg) => {
                if (err) throw err;
                this.qrcode.set(sanitizer.bypassSecurityTrustHtml(svg));
            });
        });
    }

    onRenew() {
        this.peerService.renewPeerSession().pipe(indicate(this.isReloading)).subscribe();
    }

    onSubmit() {
        let remoteId = this.remoteIdForm.value.remoteId || error("remoteId null");

        this.peerService
            .connectRemotePeer(remoteId)
            .pipe(indicate(this.isConnecting))
            .subscribe({
                complete: () => this.localStorageService.setItem("remote-id", remoteId),
                error: err => error(err),
            });
    }

    private goToDashboard() {
        this.ngZone.run(() => this.router.navigateByUrl("/dashboard", { skipLocationChange: true }));
    }

    private remoteIdValidator = (control: AbstractControl) => {
        let isForbidden = control.value === this.peerService.localId();
        return isForbidden ? { remoteId: { value: control.value } } : null;
    };

    readonly remoteIdForm = new FormGroup({
        remoteId: new FormControl(this.localStorageService.getItem("remote-id"), this.remoteIdValidator),
    });
}
