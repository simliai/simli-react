# SimliReact

A simple, easy to use react component to use Simli

## Installation

```bash
npm install @simliai/simli-react
```

## Imports

```typescript
import { SimliController, SimliReact, getRoomUrl } from "simli-react";
```

## Usage

### 1. Setup Controller

```typescript
const controller = useRef<SimliController>();
```

### 2. Add React component

```typescript
<SimliReact controller={controller.current} />
```

### 2. Get room url

```typescript
const roomUrl = await getRoomUrl({ 
  apiKey: YOUR_API_KEY,
  faceId: "tmp9i8bbq7c",
  voiceId: "f114a467-c40a-4db8-964d-aaba89cd08fa",
  systemPrompt: "You are a helpful assistant",
  firstMessage: "Hello, how can I help you today?",
});
```

### 3. Set up callback for when avatar joins (Optional)

```typescript
controller.current.setCallbackAvatarJoined(() => {
  console.log("Avatar joined");
});
```

### 4. Start connection

```typescript
await controller.current.startConnection(roomUrl);
```

### 5. Disconnect
```typescript
controller.current.stopConnection();
```


## Example

A full example can be found at  [/example/simli-react-demo](./example/simli-react-demo)


## Docs

Docs can be found at [Docs](https://docs.simli.com/introduction)