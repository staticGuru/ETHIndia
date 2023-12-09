import "./App.css";
// import VideoRecoder from "./components/videoRecoder";
import { useStateContext } from "./context";
import { useRoom } from "@huddle01/react/hooks";
import { useLocalMedia } from "@huddle01/react/hooks";
import { useLocalVideo, useLocalAudio } from "@huddle01/react/hooks";
import { useEffect, useRef } from "react";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { Recorder } from "@huddle01/server-sdk/recorder";

function App() {
  const { address, contract, connect } = useStateContext();
  const { fetchStream } = useLocalMedia();
  // const {startRecording}=useRecording();
  // const { stream, enableVideo, disableVideo, changeVideoSource } = useLocalVideo();
  const videoRef = useRef(null);
  const apiKey = "PZW2UTmHvqppR6IPTYzZ0yi5yRwKgYkN";
  const ROOM_ID = "ujt-ckug-nzo";
  const PROJECT_ID = "971ZK9nBUG_gduwudbicyZg3YMiY85_1";

  const recorder = new Recorder(PROJECT_ID, apiKey);
  // const recorder = new Recorder({PROJECT_ID},{API_KEY:apiKey});

  const { joinRoom, leaveRoom } = useRoom({
    onJoin: (room) => {
      console.log("Joined the room", room);
    },
    onLeave: (room) => {
      console.log("Left the room", room);
    },
  });

  const {
    stream,
    track,
    isVideoOn,
    enableVideo,
    disableVideo,
    replaceVideoStream,
    changeVideoSource,
    data,
  } = useLocalVideo({
    onProduceStart(producer) {
      console.log("Started producing your video stream!");
      console.log(producer);
    },
    onProduceClose(reason) {
      console.log(reason);
    },
  });
  console.log({ isVideoOn, stream, track });
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  console.log(data);

  async function startVideoProcessing() {
    const getToken = new AccessToken({
      apiKey,
      roomId: ROOM_ID,
      role: Role.HOST,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
      options: {
        metadata: {
          // you can add any custom attributes here which you want to associate with the user
          walletAddress: "axit.eth",
        },
      },
    });
    const token = await getToken.toJwt();
    await joinRoom({
      roomId: ROOM_ID,
      token,
    });
    await enableVideo();

  }

  async function stopVideoProcessing() {
    await disableVideo();
  
  }

  async function startRecording(){
    const updatedGetToken = new AccessToken({
      apiKey,
      roomId: ROOM_ID,
      role: Role.BOT,
      permissions: {
        admin: true,
       
        canRecvData: true,
        canSendData: true,
      },
      options: {
        metadata: {
          // you can add any custom attributes here which you want to associate with the user
          // walletAddress: "axit.eth",
          platform: "recording",
        },
      },
    });
    const updatedToken = await updatedGetToken.toJwt();

    recorder.startRecording({
      roomId: ROOM_ID,
      token: updatedToken,
    });
  }

  async function stopRecording(){
    await recorder.stop({
      roomId: ROOM_ID,
    });
  }
  // stream?.getVideoTracks((e)=>console.log("eventfetch",e))
  return (
    <div className="App">
      <button onClick={connect}>Connect Wallet</button>
      Guruvignesh
      <button onClick={async () => await startVideoProcessing()}>
        Fetch and Produce Video Stream
      </button>
      <button onClick={async () => await stopVideoProcessing()}>
        stop video
      </button>
      <button onClick={async () => await startRecording()}>
        start recording
      </button>
      <button onClick={async () => await stopRecording()}>
        stop recording
      </button>
      {/* <VideoRecoder /> */}
      {/* <button onClick={() => joinRoom(ROOM_ID)}>Join Room</button>
      <button onClick={() => leaveRoom(ROOM_ID)}>Leave Room</button>
  
      <button 
          onClick={() => fetchStream({ mediaDeviceKind: 'cam' })} >
          Fetch Cam Stream
        </button> */}
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        {isVideoOn && (
          <video
            ref={videoRef}
            className="w-1/2 mx-auto border-2 rounded-xl border-blue-400"
            autoPlay
            muted
          />
        )}
      </div>
    </div>
  );
}

export default App;
