interface BaseMessage {
    readonly type: MessageType;
    readonly status: MessageStatus;

    readonly sender: string;
    readonly receiver: string;
    readonly timestamp: number;

    toString(): string;
}

export interface TextMessage extends BaseMessage {
    readonly type: 'Text';

    readonly text: string;
}

export interface FileMessage extends BaseMessage {
    readonly type: 'File';

    readonly file: File;
    readonly fileName: string;
    readonly fileType: string;
    readonly fileSize: number;
}

export type MessageType = 'Text' | 'File';
export type MessageStatus = 'Success' | 'Failure' | 'Queued';
export type Message = TextMessage | FileMessage;

export class MessageMaker {
    static textMessage(
        sender: string,
        receiver: string,
        text: string,
        status: MessageStatus = 'Queued',
        timestamp: number = Date.now(),
    ): TextMessage {
        return {
            type: 'Text',
            sender: sender,
            receiver: receiver,
            text: text,
            status: status,
            timestamp: timestamp,
        };
    }

    static fileMessage(
        sender: string,
        receiver: string,
        file: File,
        status: MessageStatus = 'Queued',
        timestamp: number = Date.now(),
    ): FileMessage {
        return {
            type: 'File',
            sender: sender,
            receiver: receiver,
            file: file,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            status: status,
            timestamp: timestamp,
        };
    }
}
