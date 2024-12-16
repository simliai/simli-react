import { ConnectionState } from '../types/ConnectionState';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

type ConnectionListener = (state: ConnectionState) => void;
type E2EBody = {
    apiKey: string,
    faceId: string,
    voiceId: string,
    systemPrompt?: string,
    firstMessage?: string,
}

export class SimliController {
    private apiKey: string | null = null;
    private connectionListeners: ConnectionListener[] = [];
    private state: ConnectionState = {
        isConnected: false,
        callObject: null,
        chatbotId: null,
    };

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    mute() {
        this.state.callObject?.setLocalAudio(false);
        console.log('Muting');
    }

    unmute() {
        this.state.callObject?.setLocalAudio(true);
        console.log('Unmuting');
    }

    async startConnection(faceId: string, voiceId: string, systemPrompt?: string, firstMessage?: string) {
        try {
            console.log('Starting connection');
            if (this.apiKey === null) {
                console.error('API key is not set');
                return;
            }

            const body: E2EBody = {
                apiKey: this.apiKey.trim(),
                faceId: faceId.trim(),
                voiceId: voiceId.trim(),
                systemPrompt: systemPrompt,
                firstMessage: firstMessage,
            }

            // Remove systemPrompt and firstMessage if they are empty
            if (systemPrompt == undefined || systemPrompt.trim() === "") {
                delete body.systemPrompt;
            }
            if (firstMessage == undefined || firstMessage.trim() === "") {
                delete body.firstMessage;
            }

            // Call the API to get the room URL
            const response = await fetch("https://api.simli.ai/startE2ESession", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })

            const data = await response.json();
            const roomUrl = data.roomUrl;
            let newCallObject = DailyIframe.getCallInstance();

            if (newCallObject === undefined) {
                newCallObject = DailyIframe.createCallObject({
                    videoSource: false,
                });
            }

            newCallObject.setUserName("My name");

            await newCallObject.join({ url: roomUrl });

            newCallObject.on('participant-joined', (event) => {
                console.log('joining-meeting event', event);
                const participantId = event.participant.session_id;
                const userName = event.participant.user_name;
                if (userName === "Chatbot" && this.state.chatbotId === null) {
                    this.state = {
                        ...this.state,
                        chatbotId: participantId,
                    };
                    this.notifyListeners();
                }
            })

            this.state.callObject = newCallObject;
            this.state.isConnected = true;
            this.connectionListeners.forEach(listener => listener(this.state));
        } catch (error) {
            console.error('Error starting connection', error);
        }
    }

    stopConnection() {
        this.state.callObject?.leave();
        this.state.isConnected = false;
        this.connectionListeners.forEach(listener => listener(this.state));
    }

    addConnectionListener(listener: ConnectionListener) {
        this.connectionListeners.push(listener);
        // Immediately notify the new listener of current state
        listener(this.state);
    }

    removeConnectionListener(listener: ConnectionListener) {
        this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    }

    private notifyListeners() {
        this.connectionListeners.forEach(listener => listener(this.state));
    }

    getConnectionState(): ConnectionState {
        return this.state;
    }



}
