import "./App.css";
// import VideoRecoder from "./components/videoRecoder";
import { useStateContext } from "./context";
import { useRoom } from "@huddle01/react/hooks";
import { useLocalMedia } from "@huddle01/react/hooks";
import { useLocalVideo, useLocalAudio } from "@huddle01/react/hooks";
import { useEffect, useRef } from "react";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { Recorder } from "@huddle01/server-sdk/recorder";
import LandingSections from "./components/landingSections";
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import { ChainId } from "@thirdweb-dev/react";

// import * as faceapi from "face-api.js";

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
          // walletAddress: "axit.eth",
          platform: "recording",
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

  async function startRecording() {
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
          walletAddress: "axit.eth",
          // platform: "recording",
        },
      },
    });
    const updatedToken = await updatedGetToken.toJwt();

    recorder.startRecording({
      roomId: ROOM_ID,
      token: updatedToken,
    });
    // await Promise.all([
    //   faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    //   faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    //   faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    //   faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    // ]).then((e) =>{
    //   console.log("e",e)
    //   return recorder.startRecording({
    //     roomId: ROOM_ID,
    //     token: updatedToken,
    //   })
    // });
  }
  async function fetchRecording() {
    const data = await fetch("https://api.huddle01.com/api/v1/get-recordings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    })
      .then((response) => response.json())
      .then(({ recordings }) => console.log(recordings));
    // .then(text => console.log(text))
    console.log("lkjflskjfklsdf", data);
  }
  async function stopRecording() {
    await recorder.stop({
      roomId: ROOM_ID,
    });
    await stopVideoProcessing();
    await fetchRecording();
  }

  async function getFeesHistory(){
  const chainId=ChainId.Mainnet;
  const GASAPI_API_KEY="7f9f4e5c50f945be9686b5792ee25190"
  const GAS_API_SECRET="cN0TAJQeg8GFQnXMkXd0OK+OSFxIfi3KjPUDbF5OYuTSk9uZ1jOYjA"
  const Auth = Buffer.from(
    GASAPI_API_KEY + ":" + GAS_API_SECRET,
  ).toString("base64");
    const responseDAta= await fetch(`https://gas.staging.infura.org/networks/${chainId}/baseFeeHistory`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Auth}`,

      },
    })
      .then((response) => response.json())
      .then(({ recordings }) => console.log(recordings));
      console.log("responseDAta",responseDAta)
  }

  return (
    <>
      <div className="App bg-gray-200">
        <div className="flex mx-auto justify-between p-3">
          <div className="text-base font-bold ">Video Renderer</div>
          <div>
            <button type="button" onClick={async()=>await getFeesHistory()}>Get fees</button>
          {address ? (
            <div className="p-2 bg-blue-300 rounded-lg text-red-600 font-bold text-sm">{address}</div>
          ) : (
            <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>

          )}
          </div>
        </div>

        {/* <VideoRecoder /> */}
        {/* <button onClick={() => joinRoom(ROOM_ID)}>Join Room</button>
      <button onClick={() => leaveRoom(ROOM_ID)}>Leave Room</button>
  
      <button 
          onClick={() => fetchStream({ mediaDeviceKind: 'cam' })} >
          Fetch Cam Stream
        </button> */}
        <div className="h-screen">
          {isVideoOn ? (
            <video
              ref={videoRef}
              className="w-3/4 mx-auto mt-10 h-full border-2 rounded-xl border-gray-300 bg-gray-300"
              autoPlay
              muted
            />
          ) : (
            <div className="w-3/4 mx-auto mt-10 h-full border-2 rounded-xl border-gray-400 bg-gray-500" />
          )}
        </div>
        <div className="py-4 flex gap-3 justify-center">
          <button
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={async () => await startVideoProcessing()}
          >
            Enable camera
          </button>
          <button
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={async () => await stopVideoProcessing()}
          >
            Disable camera
          </button>
          <button
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={async () => await startRecording()}
          >
            start recording
          </button>
          <button
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={async () => await stopRecording()}
          >
            stop recording
          </button>
        </div>
      </div>
      {/* <LandingSections/> */}
    </>
  );
}

export default App;
