export enum PeerEventType {
    Open = 'open',
    Connection = 'connection',
    Call = 'call',
    Close = 'close',
    Disconnected = 'disconnected',
    Error = 'error',

    Data = 'data',
}

export enum MessageType {
    Text,
    File,
}
