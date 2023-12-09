import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { StateContextProvider } from "./context";
import { HuddleProvider, HuddleClient } from "@huddle01/react";
const PROJECT_ID = "971ZK9nBUG_gduwudbicyZg3YMiY85_1";

const huddleClient = new HuddleClient({
  projectId: PROJECT_ID,
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});
console.log("chainId", ChainId);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThirdwebProvider desiredChainId={ChainId.Mumbai}>
    <HuddleProvider key="huddle01-provider" client={huddleClient}>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </HuddleProvider>
  </ThirdwebProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
