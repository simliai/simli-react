import React, { useEffect, useState } from 'react';
import { SimliController } from './classes/SimliController';
import { ConnectionState } from './types/ConnectionState';
import { DailyProvider } from '@daily-co/daily-react';
import Tile from './components/tile';

interface SimliReactProps {
    controller: SimliController;
    className?: string;
}

export const SimliReact = ({ controller, className="h-96 w-96" }: SimliReactProps) => {
    const [connectionState, setConnectionState] = useState<ConnectionState>({
        isConnected: false,
        callObject: null,
        chatbotId: null,
    });

    useEffect(() => {
        const handleConnectionChange = (state: ConnectionState) => {
            setConnectionState(state);
        };

        controller.addConnectionListener(handleConnectionChange);

        return () => {
            controller.removeConnectionListener(handleConnectionChange);
        };
    }, [controller]);


    return (
        <div>
            {
                connectionState.callObject && (
                    <div className={className}>
                        <DailyProvider callObject={connectionState.callObject}>
                            {
                                connectionState.chatbotId && (
                                    <Tile key={connectionState.chatbotId} id={connectionState.chatbotId} />
                                )
                            }
                        </DailyProvider>
                    </div>
                )
            }
        </div>
    );
}


