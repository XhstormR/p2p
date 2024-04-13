import { effect, Injectable, signal } from '@angular/core';
import { concat, Observable, Subject } from 'rxjs';
import Peer, { DataConnection } from 'peerjs';
import { error, getRandomInt } from '../utils';
import { Message } from '../message.model';
import {
    onConnectionConnected,
    onConnectionDisconnected,
    onConnectionReceiveData,
    PeerEvent,
} from '../peer-event.model';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class PeerService {
    private peer?: Peer;
    private connectionMap = new Map<string, DataConnection>();

    private peerEventSubject$ = new Subject<PeerEvent>();
    readonly peerEvent$ = this.peerEventSubject$.asObservable();

    private localIdSignal = signal('');
    readonly localId = this.localIdSignal.asReadonly();

    private isOnlineSignal = signal(false);
    readonly isOnline = this.isOnlineSignal.asReadonly();

    constructor(private localStorageService: LocalStorageService) {
        this.initLocalId();
    }

    renewPeerSession() {
        this.localIdSignal.set(this.getRandomID());
        return concat(this.closePeerSession(), this.startPeerSession());
    }

    startPeerSession() {
        return new Observable(subscriber => {
            try {
                if (this.peer && this.isOnlineSignal()) {
                    subscriber.complete();
                } else {
                    this.peer = new Peer(this.localIdSignal());
                    this.listenPeer(this.peer);

                    this.peer.on('open', () => subscriber.complete());
                    this.peer.on('error', err => subscriber.error(err));
                }
            } catch (err) {
                subscriber.error(err);
            }
        });
    }

    closePeerSession() {
        return new Observable(subscriber => {
            try {
                if (this.peer) {
                    this.peer.destroy();
                    this.peer = undefined;
                }
                subscriber.complete();
            } catch (err) {
                subscriber.error(err);
            }
        });
    }

    connectRemotePeer(remoteId: string) {
        return new Observable(subscriber => {
            try {
                if (this.connectionMap.has(remoteId)) error('Connection existed');

                if (this.peer) {
                    let conn = this.peer.connect(remoteId);
                    this.listenConnection(conn);

                    conn.on('open', () => subscriber.complete());
                    this.peer.on('error', err => subscriber.error(err));
                } else {
                    subscriber.error('Host has lost');
                }
            } catch (err) {
                subscriber.error(err);
            }
        });
    }

    sendMessage(message: Message) {
        return new Observable(subscriber => {
            try {
                let conn = this.connectionMap.get(message.receiver);
                if (conn) {
                    let result = conn.send(message);
                    if (result instanceof Promise) {
                        fromPromise(result).subscribe(subscriber);
                    } else {
                        subscriber.complete();
                    }
                } else {
                    subscriber.error(`${message.receiver} has lost`);
                }
            } catch (err) {
                subscriber.error(err);
            }
        });
    }

    getRemotePeers() {
        return this.connectionMap.keys();
    }

    private listenPeer(peer: Peer) {
        peer.on('open', id => {
            console.log('peer open', id);
            this.isOnlineSignal.set(true);
        });

        peer.on('connection', conn => {
            console.log('peer connection', conn);
            this.listenConnection(conn);
        });

        peer.on('disconnected', currentId => {
            console.warn('peer disconnected', currentId);
            if (!peer.disconnected) {
                console.warn('reconnect', currentId);
                peer.reconnect();
            }
        });

        peer.on('close', () => {
            console.warn('peer close');
            this.isOnlineSignal.set(false);
        });

        peer.on('error', err => {
            console.error('peer error', err.type, err.message);
        });
    }

    private listenConnection(conn: DataConnection) {
        conn.on('open', () => {
            console.log('connection open');
            this.connectionMap.set(conn.peer, conn);
            this.peerEventSubject$.next(onConnectionConnected(conn.peer));
        });

        conn.on('data', receivedData => {
            console.log('connection data', receivedData);
            this.peerEventSubject$.next(onConnectionReceiveData(receivedData as Message));
        });

        conn.on('close', () => {
            console.warn('connection close');
            this.connectionMap.delete(conn.peer);
            this.peerEventSubject$.next(onConnectionDisconnected(conn.peer));
        });

        conn.on('error', err => {
            console.error('connection error', err.type, err.message);
        });
    }

    private getRandomID() {
        return `${getRandomInt(100, 1000)}-${getRandomInt(100, 1000)}`;
    }

    private initLocalId() {
        let localId = this.localStorageService.getItem('local-id') || this.getRandomID();
        this.localIdSignal.set(localId);
        effect(() => this.localStorageService.setItem('local-id', this.localIdSignal()));
    }
}
