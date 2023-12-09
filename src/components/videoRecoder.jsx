import React, { useEffect } from "react";
// import { useHuddle01 } from "@huddle01/react";
import { useVideo } from "@huddle01/react/hooks";
import { useRecording } from '@huddle01/react/hooks';
import VideoSystem from "./videoSystem";


function VideoRecoder() {
//   const { initialize, isInitialized } = useHuddle01();
  const API_KEYS = "PZW2UTmHvqppR6IPTYzZ0yi5yRwKgYkN";
  const PROJECT_ID = "971ZK9nBUG_gduwudbicyZg3YMiY85_1";


//   useEffect(() => {
//     // its preferable to use env vars to store projectId
//     initialize(PROJECT_ID);
//   }, []);

//   function stoprecordingFunction(){
    
//   }
//   if(inProgress) return (<div>...loading</div>)

  return (
    <>
      {/* <div>{isInitialized ? "Hello World!" : "Please initialize"}</div>{" "} */}
      {/* <button
        disabled={!fetchVideoStream.isCallable}
        onClick={fetchVideoStream}
      >
        FETCH_VIDEO_STREAM    disabled={!startRecording.isCallable}
      </button> */}
{/* <VideoSystem/> */}
    </>
  );
}

export default VideoRecoder;
