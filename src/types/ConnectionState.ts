import { DailyCall } from '@daily-co/daily-js';

export interface ConnectionState {
    isConnected: boolean;
    callObject: DailyCall | null;
    chatbotId: string | null;
}