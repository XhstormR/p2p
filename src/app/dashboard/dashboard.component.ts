import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../service/notification.service';
import { PeerService } from '../service/peer.service';
import { PeerEventType } from '../peer-event.model';
import { error } from '../utils';
import { defaultIfEmpty, lastValueFrom } from 'rxjs';
import { DropZoneDirective } from '../drop-zone.directive';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutService } from '../service/layout.service';
import { MessageService } from '../service/message.service';
import { MessageListComponent } from '../message-list/message-list.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        DropZoneDirective,
        MessageListComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    host: {
        '(window:beforeunload)': 'onBeforeUnload()',
    },
})
export class DashboardComponent {
    readonly peers = model(new Set<string>());
    readonly inputText = model('');
    readonly selectedFile = model<File>();
    readonly selectedPeer = model<string>();

    constructor(
        private notificationService: NotificationService,
        private messageService: MessageService,
        public layoutService: LayoutService,
        public peerService: PeerService,
    ) {
        this.peers.set(new Set(peerService.getRemotePeers()));

        peerService.peerEvent$.subscribe(event => {
            switch (event.type) {
                case PeerEventType.onConnectionDisconnected: {
                    let peer = event.peer;
                    this.notificationService.open(`${peer} has lost`);
                    break;
                }
                case PeerEventType.onConnectionConnected: {
                    let peer = event.peer;
                    this.peers.update(v => new Set(v.add(peer)));
                    this.notificationService.open(`New connection from: ${peer} `);
                    break;
                }
            }
        });
    }

    onSend(event: Event) {
        event.preventDefault();
        let selectedPeer = this.selectedPeer() || error('no peer selected');

        let text = this.inputText().trim();
        if (text.length !== 0) {
            this.messageService.sendTextMessage(selectedPeer, text);
            this.inputText.set('');
        }

        let selectedFile = this.selectedFile();
        if (selectedFile && selectedFile.size !== 0) {
            this.messageService.sendFileMessage(selectedPeer, selectedFile);
            this.selectedFile.set(undefined);
        }
    }

    onFileChanged(event: Event) {
        let target = event.currentTarget as HTMLInputElement;
        this.selectedFile.set(target?.files?.[0]);
    }

    onFileDrop(files: Array<File>) {
        this.selectedFile.set(files[0]);
    }

    onPeerChanged(event: MatSelectionListChange) {
        let peer = event.options[0].value;
        this.selectedPeer.set(peer);
    }

    async onBeforeUnload() {
        await lastValueFrom(this.peerService.closePeerSession().pipe(defaultIfEmpty(0)));
    }
}
