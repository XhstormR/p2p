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
import { blobToString, Message, stringToBlob } from '../message.model';
import { MessageType, PeerEventType } from '../enums';
import { NotificationService } from '../service/notification.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileSizePipe } from '../file-size.pipe';
import { WebRTCService } from '../service/webrtc.service';

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
    MessageType = MessageType;

    constructor(
        private notificationService: NotificationService,
        private webRTCService: WebRTCService,
    ) {
        webRTCService.getPeerEvent().subscribe({
            next: event => {
                if (event.type === PeerEventType.Data) {
                    let payload = event.payload as Message;
                    if (payload.type === MessageType.File) {
                        console.log(payload);
                        if (payload.attachmentBase64)
                            payload.attachment = stringToBlob(payload.attachmentBase64);
                        console.log(payload);
                    }
                    this.messages.update(v => [...v, payload]);
                }
            },
        });
    }

    async onCopy(message: Message) {
        await navigator.clipboard.writeText(message.text);
        this.notificationService.open('Copied!');
    }

    onSave(message: Message) {
        if (message.attachment) {
            this.download(message.attachment, message.text);
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
        return message.from === this.webRTCService.localId();
    }

    private download(blob: Blob, filename: string) {
        let url = URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 500);
    }

    private sendText(text: string) {
        let message: Message = {
            from: this.webRTCService.localId(),
            to: this.webRTCService.getRemotePeers().next().value,
            text: text,
            type: MessageType.Text,
            createdAt: Date.now(),
        };
        this.sendMessage(message);
    }

    private async sendFile(file: File) {
        let attachmentString = await blobToString(file);
        let message: Message = {
            from: this.webRTCService.localId(),
            to: this.webRTCService.getRemotePeers().next().value,
            text: file.name,
            type: MessageType.File,
            createdAt: Date.now(),
            attachment: file,
            attachmentBase64: attachmentString,
        };
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
