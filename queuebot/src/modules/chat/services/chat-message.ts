export interface ChatMessage {
    id: string;
    username: string;
    channelName: string;
    message: string;
    emotes: Map<string, string[]>;
    date: Date;
    color: string;
}
