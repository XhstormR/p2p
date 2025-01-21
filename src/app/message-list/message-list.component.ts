import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { MessageService } from "../service/message.service";
import { EventService } from "../service/event.service";
import { MessageComponent } from "../message/message.component";

@Component({
    selector: "app-message-list",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MessageComponent],
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
        private messageService: MessageService,
        private eventService: EventService,
    ) {}
}
