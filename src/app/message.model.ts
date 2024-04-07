interface BaseMessage {
    readonly type: MessageType.Text | MessageType.File;

    readonly sender: string;
    readonly receiver: string;
    readonly timestamp: number;

    toString(): string;
}

export interface TextMessage extends BaseMessage {
    readonly type: MessageType.Text;

    readonly text: string;
}

export interface FileMessage extends BaseMessage {
    readonly type: MessageType.File;

    readonly file: File;
    readonly fileName: string;
    readonly fileType: string;
    readonly fileSize: number;
}

class TextMessageImpl implements TextMessage {
    readonly type = MessageType.Text;

    constructor(
        public sender: string,
        public receiver: string,
        public text: string,
        public timestamp: number = Date.now(),
    ) {}

    toString(): string {
        return `[${this.timestamp}] ${this.sender} -> ${this.receiver}: ${this.text}`;
    }
}

class FileMessageImpl implements FileMessage {
    readonly type = MessageType.File;

    constructor(
        public sender: string,
        public receiver: string,
        public file: File,
        public fileName: string,
        public fileType: string,
        public fileSize: number,
        public timestamp: number = Date.now(),
    ) {}

    toString(): string {
        return `[${this.timestamp}] ${this.sender} -> ${this.receiver}: ${this.fileName} (size: ${this.fileSize} bytes)`;
    }
}

export enum MessageType {
    Text,
    File,
}

export type Message = TextMessage | FileMessage;

export class MessageMaker {
    static textMessage(sender: string, receiver: string, text: string): TextMessage {
        return new TextMessageImpl(sender, receiver, text);
    }

    static fileMessage(sender: string, receiver: string, file: File): FileMessage {
        return new FileMessageImpl(sender, receiver, file, file.name, file.type, file.size);
    }
}
