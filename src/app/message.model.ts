import { MessageType } from './enums';

export interface Message {
    readonly from: string;
    readonly to: string;
    readonly text: string;
    readonly type: MessageType;
    attachment?: Blob;
    readonly attachmentBase64?: string;
    readonly createdAt: number;
}

function bytesToBase64(uint8: ArrayLike<number>) {
    let binString = Array.from(uint8, byte => String.fromCodePoint(byte)).join('');
    return btoa(binString);
}

function base64ToBytes(base64: string) {
    let binString = atob(base64);
    return Uint8Array.from(binString, char => char.charCodeAt(0));
}

export async function blobToString(blob: Blob): Promise<string> {
    let stream = await blob.stream().getReader().read();
    let uint8 = stream.value;
    if (uint8) return blob.type + '#' + bytesToBase64(uint8);
    else return Promise.reject();
}

export function stringToBlob(str: string) {
    let data = str.split('#');
    let uint8 = base64ToBytes(data[1]);
    return new Blob([uint8], { type: data[0] });
}
