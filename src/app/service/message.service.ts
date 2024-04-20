import { Injectable } from '@angular/core';
import { PeerService } from './peer.service';
import { Message, MessageMaker } from '../message.model';
import { error } from '../utils';
import { PeerEventType } from '../peer-event.model';
import { EventService } from './event.service';
import { finalize } from 'rxjs/operators';

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
                    message.status = 'Success';
                    this.addPeerMessage(message.sender, message);
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
        this.peerService
            .sendMessage(message)
            .pipe(finalize(() => this.notifyMessageChanged(peer)))
            .subscribe({
                complete: () => (message.status = 'Success'),
                error: err => {
                    message.status = 'Failure';
                    error(err);
                },
            });
    }

    private addPeerMessage(peer: string, message: Message) {
        let messages = this.getPeerMessages(peer);
        messages.push(message);

        this.messageMap.set(peer, messages);
        this.notifyMessageChanged(peer);
    }

    private notifyMessageChanged(peer: string) {
        this.eventService.emitEvent(peer, this.messageMap.get(peer));
    }
}
