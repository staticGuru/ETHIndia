// import React from "react";
// import { useRecording } from "@huddle01/react/hooks";

// function VideoSystem() {
//   const {
//     startRecording,
//     stoprecording,
//     isStarting,
//     inProgress,
//     isStopping,
//     error,
//     data,
//   } = useRecording();
//   if (inProgress) return <div>...loading</div>;
//   console.log("dataerere", data);
//   return (
//     <>
//       <button
//         // disabled={!startRecording.isCallable}
//         onClick={async () => await startRecording()}
//       >
//         START_RECORDING
//       </button>
//       {isStarting ? "Recording is starting" : error}
//       <button onClick={stoprecording}>STOP_RECORDING</button>
//     </>
//   );
// }

// export default VideoSystem;
