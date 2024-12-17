'use client';
import { useRef, useState } from "react";
import { SimliController, SimliReact, getRoomUrl } from "simli-react";

type MyAppState = "connecting" | "connected" | "Empty";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_SIMLI_API_KEY || "";
  if (!apiKey) {
    throw new Error("SIMLI_API_KEY is not set");
  }

  const controller = useRef<SimliController>(new SimliController());
  const [appState, setAppState] = useState<MyAppState>("Empty");


  console.log(apiKey);
  const handleConnect = async () => {
    console.log("Connecting");
    setAppState("connecting");

    const roomUrl = await getRoomUrl({
      apiKey: apiKey,
      faceId: "tmp9i8bbq7c",
      voiceId: "f114a467-c40a-4db8-964d-aaba89cd08fa",
      systemPrompt: "You are a helpful assistant",
      firstMessage: "Hello, how can I help you today?",
    })

    controller.current.setCallbackAvatarJoined(() => {
      console.log("Avatar joined");
    });

    console.log("joining room", roomUrl);
    await controller.current.startConnection(roomUrl);
    setAppState("connected");

  }

  const handleDisconnect = () => {
    controller.current.stopConnection();
    setAppState("Empty");
  }

  return (
    <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20  font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-4 w-full items-center">

        <SimliReact controller={controller.current} />

        {
          appState === "Empty" && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleConnect}>
              Connect
            </button>
          )
        }
        {
          appState === "connecting" && (
            <div className="text-black">
              Connecting...
            </div>
          )
        }

        {
          appState === "connected" && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleDisconnect}>
              Disconnect
            </button>
          )
        }

      </div>

    </div>
  );
}
