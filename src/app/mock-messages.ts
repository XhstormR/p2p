import { Message, MessageMaker } from "./message.model";

export const MESSAGES: Message[] = [
    MessageMaker.textMessage(
        "123-123",
        "123-123",
        "The Shiba Inu is the smallest of the six original and distinct",
        "Success",
    ),
    MessageMaker.textMessage(
        "123-123",
        "123-123",
        "The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.",
        "Success",
    ),
    MessageMaker.textMessage(
        "123-123",
        "123-123",
        "The Shiba Inu is the smallest of the six original and distinct",
        "Queued",
    ),
    MessageMaker.textMessage(
        "123-123",
        "123-123",
        "The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.",
        "Failure",
    ),
];
