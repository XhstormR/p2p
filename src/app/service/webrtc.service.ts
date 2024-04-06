import { Injectable, signal } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import Peer, { DataConnection } from 'peerjs';
import { getRandomInt } from '../utils';
import { PeerEventType } from '../enums';
import { Message } from '../message.model';
import { PeerEvent } from '../peer-event.model';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
    providedIn: 'root',
})
export class WebRTCService {
    private peer = new Peer(this.getRandomID());
    private peerEvent$ = new Subject<PeerEvent>();
    private connections = new Map<string, DataConnection>();
    private localIdSignal = signal('');
    readonly localId = this.localIdSignal.asReadonly();
    private isOnlineSignal = signal(false);
    readonly isOnline = this.isOnlineSignal.asReadonly();

    renewPeer() {
        this.peer.destroy();
        this.peer = new Peer(this.getRandomID());
        this.listenPeer();

        let subject = new Subject();
        this.peer.on('open', () => subject.complete());
        this.peer.on('error', err => subject.error(err));
        return subject.asObservable();
    }

    connect(remoteId: string) {
        if (!this.isOnline()) return EMPTY;

        let conn = this.peer.connect(remoteId);
        this.listenConn(conn);

        let subject = new Subject();
        conn.on('open', () => subject.complete());
        this.peer.on('error', err => subject.error(err));
        return subject.asObservable();
    }

    listenPeer() {
        this.isOnlineSignal.set(false);
        this.peer.on('open', id => {
            console.log('peer open', id);
            this.localIdSignal.set(id);
            this.isOnlineSignal.set(true);
        });

        this.peer.on('connection', conn => {
            console.log('peer connection', conn);
            this.listenConn(conn);

            this.peerEvent$.next({
                type: PeerEventType.Connection,
                payload: conn.peer,
            });
        });

        this.peer.on('disconnected', currentId => {
            console.warn('peer disconnected', currentId);
            if (!this.peer.disconnected) {
                this.peer.reconnect();
            }
        });

        this.peer.on('close', () => {
            console.warn('peer close');
            this.isOnlineSignal.set(false);
        });

        this.peer.on('error', err => {
            console.error('peer error', err.type, err.message);
        });
    }

    listenConn(conn: DataConnection) {
        conn.on('open', () => {
            console.log('connection open');
            this.connections.set(conn.peer, conn);
        });

        conn.on('data', data => {
            console.log('connection data', data);
            this.peerEvent$.next({
                type: PeerEventType.Data,
                payload: data,
            });
        });

        conn.on('close', () => {
            console.warn('connection close');
            this.connections.delete(conn.peer);
        });

        conn.on('error', err => {
            console.error('connection error', err.type, err.message);
        });
    }

    sendMessage(message: Message) {
        if (!this.isOnline()) return EMPTY;

        let subject = new Subject();

        let conn = this.connections.get(message.to);
        if (!conn) {
            subject.error('message.to is lost');
        } else {
            let result = conn.send(message);
            if (result instanceof Promise) {
                return fromPromise(result);
            } else {
                subject.complete();
            }
        }

        return subject.asObservable();
    }

    getPeerEvent() {
        return this.peerEvent$.asObservable();
    }

    getRemotePeers() {
        return this.connections.keys();
    }

    getRandomID() {
        return `${getRandomInt(1000, 10000)}-${getRandomInt(1000, 10000)}`;
    }
}
