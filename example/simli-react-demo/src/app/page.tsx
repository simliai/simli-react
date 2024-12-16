'use client';
import { useEffect, useRef, useState } from "react";
import { SimliController, SimliReact } from "simli-react";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_SIMLI_API_KEY || ""; 
  if (!apiKey) {
    throw new Error("SIMLI_API_KEY is not set");
  }

  // const controller useRef<SimliController | null>(null);
  const [controller, setController] = useState<SimliController | null>(null);

  useEffect(() => {
    if (controller) {
      return;
    }
    setController(new SimliController(apiKey));
  }, []);

  console.log(apiKey);
  // const controller = new SimliController(apiKey);
  const handleConnect = async () => {
    console.log("Connecting");
    await controller?.startConnection(
      "tmp9i8bbq7c",
      "f114a467-c40a-4db8-964d-aaba89cd08fa",
      "You are a helpful assistant",
      "Hello, how can I help you today?"
    );
    console.log("Connected");
  }

  const handleDisconnect = () => {
    controller?.stopConnection();
  }

  return (
    <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-4">
        {
          controller && (
            <SimliReact controller={controller} />
          )
        }
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleConnect}>
          Connect
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>

    </div>
  );
}
