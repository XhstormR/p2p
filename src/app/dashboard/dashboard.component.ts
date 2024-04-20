import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThrottleButtonDirective } from '../throttle-button.directive';
import { FileMessage, Message, TextMessage } from '../message.model';
import { NotificationService } from '../service/notification.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileSizePipe } from '../file-size.pipe';
import { PeerService } from '../service/peer.service';
import { PeerEventType } from '../peer-event.model';
import { download, error } from '../utils';
import { defaultIfEmpty, lastValueFrom, Subscription } from 'rxjs';
import { DropZoneDirective } from '../drop-zone.directive';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutService } from '../service/layout.service';
import { MessageService } from '../service/message.service';
import { EventService } from '../service/event.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        TextFieldModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatProgressBarModule,
        DatePipe,
        FileSizePipe,
        ThrottleButtonDirective,
        DropZoneDirective,
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
    readonly selectedPeerMessages = model<Message[]>();
    selectedPeerMessagesSubscriptions?: Subscription;

    constructor(
        private notificationService: NotificationService,
        private clipboard: Clipboard,
        private messageService: MessageService,
        private eventService: EventService,
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

    onCopy(message: TextMessage) {
        if (this.clipboard.copy(message.text)) {
            this.notificationService.open('Copied!');
        } else {
            this.notificationService.open('Copy failed!');
        }
    }

    onSave(message: FileMessage) {
        message.file || error('Attachment is null');
        download(message.file, message.fileName, message.fileType);
        this.notificationService.open('Saved!');
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
        this.selectedPeerMessages.set(this.messageService.getPeerMessages(peer));
        this.selectedPeerMessagesSubscriptions?.unsubscribe();
        this.selectedPeerMessagesSubscriptions = this.eventService
            .onEvent<Message[]>(peer)
            .subscribe(v => this.selectedPeerMessages.set([...v]));
    }

    async onBeforeUnload() {
        await lastValueFrom(this.peerService.closePeerSession().pipe(defaultIfEmpty(0)));
    }
}
