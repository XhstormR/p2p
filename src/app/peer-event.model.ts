import { PeerEventType } from './enums';

export interface PeerEvent {
    readonly type: PeerEventType;
    readonly payload?: any;
}
