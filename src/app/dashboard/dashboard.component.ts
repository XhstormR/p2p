import { Component, model } from '@angular/core';
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
import { WebRTCService } from '../service/webrtc.service';
import { PeerEventType } from '../peer-event.model';
import { download } from '../utils';

@Component({
    selector: 'app-dashboard',
    standalone: true,
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
    messages = model<Message[]>([]);
    inputText = model('');
    selectedFile?: File;
    blop = new Audio('/assets/sounds/blop.mp3');

    constructor(
        private notificationService: NotificationService,
        private webRTCService: WebRTCService,
    ) {
        this.blop.load();
        webRTCService.getPeerEvent().subscribe({
            next: event => {
                if (event.type === PeerEventType.Data) {
                    let message = event.payload as Message;
                    console.log(message);
                    switch (message.type) {
                        case 'File':
                            message.fileName;
                            break;
                        case 'Text': {
                            message.text;
                            break;
                        }
                    }
                    this.blop.play();
                    this.messages.update(v => [...v, message]);
                }
            },
        });
    }

    async onCopy(message: TextMessage) {
        await navigator.clipboard.writeText(message.text);
        this.notificationService.open('Copied!');
    }

    onSave(message: FileMessage) {
        if (message.file) {
            download(message.file, message.fileType, message.fileName);
            this.notificationService.open('Saved!');
        } else {
            throw new Error('Attachment is null');
        }
    }

    onSend() {
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

    isMe(message: Message) {
        return message.sender === this.webRTCService.localId();
    }

    private sendText(text: string) {
        let message = MessageMaker.textMessage(
            this.webRTCService.localId(),
            this.webRTCService.getRemotePeers().next().value,
            text,
        );
        this.sendMessage(message);
    }

    private async sendFile(file: File) {
        let message = MessageMaker.fileMessage(
            this.webRTCService.localId(),
            this.webRTCService.getRemotePeers().next().value,
            file,
        );
        this.sendMessage(message);
    }

    private sendMessage(message: Message) {
        this.messages.update(v => [...v, message]);
        this.webRTCService.sendMessage(message).subscribe({
            complete: () => {},
            error: err => {
                throw err;
            },
        });
    }
}
