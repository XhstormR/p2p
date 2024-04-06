import { Message } from './message.model';
import { MessageType } from './enums';

export const MESSAGES: Message[] = [
    {
        from: '1234-1234',
        to: '1234-1234',
        text: 'The Shiba Inu is the smallest of the six original and distinct',
        type: MessageType.Text,
        createdAt: Date.now(),
    },
    {
        from: '1234-1234',
        to: '1234-1234',
        text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.',
        type: MessageType.Text,
        createdAt: Date.now(),
    },
    {
        from: '1234-1234',
        to: '1234-1234',
        text: 'The Shiba Inu is the smallest of the six',
        type: MessageType.Text,
        createdAt: Date.now(),
    },
    {
        from: '1234-1234',
        to: '1234-1234',
        text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.',
        type: MessageType.Text,
        createdAt: Date.now(),
    },
];
