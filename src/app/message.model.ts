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

}

}

}
