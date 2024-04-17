import { Injectable } from '@angular/core';
import { PeerService } from './peer.service';
import { Message, MessageMaker } from '../message.model';
import { error } from '../utils';
import { PeerEventType } from '../peer-event.model';
import { EventService } from './event.service';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private messageMap = new Map<string, Message[]>();
    private blop = new Audio('/assets/sounds/blop.mp3');

    constructor(
        private peerService: PeerService,
        private eventService: EventService,
    ) {
        this.blop.load();

        peerService.peerEvent$.subscribe(event => {
            switch (event.type) {
                case PeerEventType.onConnectionReceiveData: {
                    let message = event.data;
                    this.addPeerMessage(message.sender, message._copy({ status: 'Success' }));
                    this.blop.play();
                    break;
                }
            }
        });
    }

    getPeerMessages(peer: string) {
        return this.messageMap.get(peer) || [];
    }

    sendTextMessage(peer: string, text: string) {
        let message = MessageMaker.textMessage(this.peerService.localId(), peer, text);
        this.sendPeerMessage(peer, message);
    }

    sendFileMessage(peer: string, file: File) {
        let message = MessageMaker.fileMessage(this.peerService.localId(), peer, file);
        this.sendPeerMessage(peer, message);
    }

    private sendPeerMessage(peer: string, message: Message) {
        this.addPeerMessage(peer, message);
        this.peerService.sendMessage(message).subscribe({
            complete: () => this.updatePeerMessage(peer, message._copy({ status: 'Success' })),
            error: err => {
                this.updatePeerMessage(peer, message._copy({ status: 'Failure' }));
                error(err);
            },
        });
    }

    private addPeerMessage(peer: string, message: Message) {
        let messages = this.messageMap.get(peer) || [];
        messages.push(message);

        this.messageMap.set(peer, messages);
        this.eventService.emitEvent(peer, messages);
    }

    private updatePeerMessage(peer: string, message: Message) {
        let messages = this.messageMap.get(peer);
        if (!messages) return;
        messages = messages.map(old => (old.timestamp === message.timestamp ? message : old));

        this.messageMap.set(peer, messages);
        this.eventService.emitEvent(peer, messages);
    }
}
