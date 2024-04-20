import { ChangeDetectionStrategy, Component, effect, input, model } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FileSizePipe } from '../file-size.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThrottleButtonDirective } from '../throttle-button.directive';
import { FileMessage, Message, TextMessage } from '../message.model';
import { download, error } from '../utils';
import { NotificationService } from '../service/notification.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from '../service/message.service';
import { EventService } from '../service/event.service';
import { PeerService } from '../service/peer.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-message-list',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule,
        MatProgressBarModule,
        DatePipe,
        FileSizePipe,
        ThrottleButtonDirective,
    ],
    templateUrl: './message-list.component.html',
    styleUrl: './message-list.component.scss',
})
export class MessageListComponent {
    readonly selectedPeer = input<string>();
    readonly selectedPeerMessages = model<Message[]>();
    selectedPeerMessagesSubscriptions?: Subscription;

    constructor(
        private notificationService: NotificationService,
        private clipboard: Clipboard,
        private messageService: MessageService,
        private eventService: EventService,
        public peerService: PeerService,
    ) {
        effect(
            () => {
                let peer = this.selectedPeer();
                if (peer) this.onPeerChanged(peer);
            },
            { allowSignalWrites: true },
        );
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

    onPeerChanged(peer: string) {
        this.selectedPeerMessages.set(this.messageService.getPeerMessages(peer));
        this.selectedPeerMessagesSubscriptions?.unsubscribe();
        this.selectedPeerMessagesSubscriptions = this.eventService
            .onEvent<Message[]>(peer)
            .subscribe(v => this.selectedPeerMessages.set([...v]));
    }
}
