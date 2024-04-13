import { ChangeDetectionStrategy, Component, HostListener, model } from '@angular/core';
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
import { FileMessage, Message, MessageMaker, TextMessage } from '../message.model';
import { NotificationService } from '../service/notification.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileSizePipe } from '../file-size.pipe';
import { PeerService } from '../service/peer.service';
import { PeerEventType } from '../peer-event.model';
import { download, error } from '../utils';
import { defaultIfEmpty, lastValueFrom } from 'rxjs';

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
        MatProgressBarModule,
        DatePipe,
        FileSizePipe,
        ThrottleButtonDirective,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    readonly messages = model<Message[]>([]);
    readonly inputText = model('');
    readonly blop = new Audio('/assets/sounds/blop.mp3');
    selectedFile?: File;

    constructor(
        private notificationService: NotificationService,
        public peerService: PeerService,
    ) {
        this.blop.load();
        peerService.peerEvent$.subscribe(event => {
            switch (event.type) {
                case PeerEventType.onConnectionReceiveData: {
                    let message = event.data;
                    message = message._copy({ status: 'Success' });
                    this.messages.update(v => [...v, message]);
                    this.blop.play();
                    break;
                }
                case PeerEventType.onConnectionDisconnected: {
                    let peer = event.peer;
                    this.notificationService.open(`${peer} has lost`);
                    break;
                }
                case PeerEventType.onConnectionConnected: {
                    let peer = event.peer;
                    this.notificationService.open(`New connection from: ${peer} `);
                    break;
                }
            }
        });
    }

    onCopy(message: TextMessage) {
        navigator.clipboard.writeText(message.text);
        this.notificationService.open('Copied!');
    }

    onSave(message: FileMessage) {
        message.file || error('Attachment is null');
        download(message.file, message.fileName, message.fileType);
        this.notificationService.open('Saved!');
    }

    onSend(event: Event) {
        event.preventDefault();

        let text = this.inputText().trim();
        if (text.length !== 0) {
            this.sendText(text);
            this.inputText.set('');
        }

        let size = this.selectedFile?.size || 0;
        if (size !== 0 && this.selectedFile) {
            this.sendFile(this.selectedFile);
            this.selectedFile = undefined;
        }
    }

    onFileChanged(event: Event) {
        let target = event.currentTarget as HTMLInputElement;
        this.selectedFile = target?.files?.[0];
        target.value = '';
    }

    @HostListener('window:beforeunload')
    async onBeforeUnload() {
        await lastValueFrom(this.peerService.closePeerSession().pipe(defaultIfEmpty(0)));
    }

    private sendText(text: string) {
        let message = MessageMaker.textMessage(
            this.peerService.localId(),
            this.peerService.getRemotePeers().next().value || error('no remote peers'), // TODO
            text,
        );
        this.sendMessage(message);
    }

    private sendFile(file: File) {
        let message = MessageMaker.fileMessage(
            this.peerService.localId(),
            this.peerService.getRemotePeers().next().value || error('no remote peers'), // TODO
            file,
        );
        this.sendMessage(message);
    }

    private sendMessage(message: Message) {
        this.messages.update(v => [...v, message]);
        this.peerService.sendMessage(message).subscribe({
            complete: () => this.updateMessage(message._copy({ status: 'Success' })),
            error: err => {
                this.updateMessage(message._copy({ status: 'Failure' }));
                error(err);
            },
        });
    }

    private updateMessage(message: Message) {
        this.messages.update(v => v.map(old => (old.timestamp === message.timestamp ? message : old)));
    }
}
