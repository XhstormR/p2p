import { Component, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FileSizePipe } from "../file-size.pipe";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ThrottleButtonDirective } from "../throttle-button.directive";
import { NotificationService } from "../service/notification.service";
import { Clipboard } from "@angular/cdk/clipboard";
import { PeerService } from "../service/peer.service";
import { FileMessage, Message, TextMessage } from "../message.model";
import { download, error } from "../utils";

@Component({
    selector: "app-message",
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
    templateUrl: "./message.component.html",
    styleUrl: "./message.component.scss",
})
export class MessageComponent {
    @Input() message!: Message;

    constructor(
        private notificationService: NotificationService,
        private clipboard: Clipboard,
        public peerService: PeerService,
    ) {}

    onCopy(message: TextMessage) {
        if (this.clipboard.copy(message.text)) {
            this.notificationService.open("Copied!");
        } else {
            this.notificationService.open("Copy failed!");
        }
    }

    onSave(message: FileMessage) {
        message.file || error("Attachment is null");
        download(message.file, message.fileName, message.fileType);
        this.notificationService.open("Saved!");
    }
}
