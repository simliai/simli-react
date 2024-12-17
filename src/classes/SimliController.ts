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
    private connectionListeners: ConnectionListener[] = [];
    private state: ConnectionState = {
        isConnected: false,
        callObject: null,
        chatbotId: null,
    };
    private callbackAvatarJoined?: () => void;


    mute() {
        this.state.callObject?.setLocalAudio(false);
        console.log('Muting');
    }

    unmute() {
        this.state.callObject?.setLocalAudio(true);
        console.log('Unmuting');
    }

    async startConnection(roomUrl: string) {
        try {
            console.log('Starting connection');
            
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
                    if (this.callbackAvatarJoined) {
                        this.callbackAvatarJoined();
                    }
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

    setCallbackAvatarJoined(callback: () => void) {
        this.callbackAvatarJoined = callback;
    }

}
