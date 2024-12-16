
interface SimliRequestProps {
    apiKey: string;
    faceId: string;
    voiceId: string;
    systemPrompt?: string;
    firstMessage?: string;
}

export async function getRoomUrl({apiKey, faceId, voiceId, systemPrompt, firstMessage}: SimliRequestProps) {
    if (!apiKey) {
        console.error('API key is not set');
        return;
    }

    const body = {
        apiKey: apiKey.trim(),
        faceId: faceId.trim(),
        voiceId: voiceId.trim(),
        systemPrompt: systemPrompt,
        firstMessage: firstMessage,
    }

    // Remove systemPrompt and firstMessage if they are empty
    if (!systemPrompt || systemPrompt == undefined || systemPrompt.trim() === "") {
        delete body.systemPrompt;
    }
    if (!firstMessage || firstMessage == undefined || firstMessage.trim() === "") {
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
    return roomUrl;
}