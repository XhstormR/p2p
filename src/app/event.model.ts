import { PeerEvent } from "./peer-event.model";
import { Message } from "./message.model";

export type EventMap = {
    PeerEvent: PeerEvent;
    MessageEvent: MessageEvent;
};

export type MessageEvent = {
    peer: string;
    messages: Message[];
};

export const onMessageChanged = (peer: string, messages: Message[]): MessageEvent => ({
    peer,
    messages,
});
