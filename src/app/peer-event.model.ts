export interface PeerEvent {
    readonly type: PeerEventType;
    readonly payload?: any;
}

export enum PeerEventType {
    Open = 'open',
    Connection = 'connection',
    Call = 'call',
    Close = 'close',
    Disconnected = 'disconnected',
    Error = 'error',

    Data = 'data',
}
