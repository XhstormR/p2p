import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FileSizePipe } from "../file-size.pipe";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ThrottleButtonDirective } from "../throttle-button.directive";
import { FileMessage, TextMessage } from "../message.model";
import { download, error } from "../utils";
import { NotificationService } from "../service/notification.service";
import { Clipboard } from "@angular/cdk/clipboard";
import { MessageService } from "../service/message.service";
import { EventService } from "../service/event.service";
import { PeerService } from "../service/peer.service";

@Component({
    selector: "app-message-list",
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
    templateUrl: "./message-list.component.html",
    styleUrl: "./message-list.component.scss",
})
export class MessageListComponent {
    readonly messageEvent = this.eventService.onEvent("MessageEvent")._toSignal();
    readonly selectedPeer = input<string>();
    readonly selectedPeerMessages = computed(() => {
        let messageEvent = this.messageEvent();
        let selectedPeer = this.selectedPeer();
        if (selectedPeer) {
            if (messageEvent && messageEvent.peer === selectedPeer) {
                return [...messageEvent.messages];
            } else {
                return this.messageService.getPeerMessages(selectedPeer);
            }
        } else {
            return [];
        }
    });

    constructor(
        private notificationService: NotificationService,
        private clipboard: Clipboard,
        private messageService: MessageService,
        private eventService: EventService,
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
