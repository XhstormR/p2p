import { Message } from './message.model';

export enum PeerEventType {
    onConnectionConnected,
    onConnectionReceiveData,
    onConnectionDisconnected,
}

export type PeerEvent =
    | { type: PeerEventType.onConnectionConnected; peer: string }
    | { type: PeerEventType.onConnectionReceiveData; data: Message }
    | { type: PeerEventType.onConnectionDisconnected; peer: string };

export const onConnectionConnected = (peer: string): PeerEvent => ({
    type: PeerEventType.onConnectionConnected,
    peer,
});

export const onConnectionReceiveData = (data: Message): PeerEvent => ({
    type: PeerEventType.onConnectionReceiveData,
    data,
});

export const onConnectionDisconnected = (peer: string): PeerEvent => ({
    type: PeerEventType.onConnectionDisconnected,
    peer,
});
