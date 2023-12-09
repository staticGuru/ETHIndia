import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  //   var VITE_CONTRACT_DEPLOY_ADDRESS = "contract deploy address";
  //   const { contract } = useContract(VITE_CONTRACT_DEPLOY_ADDRESS); //thirdweb deployed address
  //   const { mutateAsync: createCampaign } = useContractWrite(
  //     contract,
  //     "createCampaign"
  //   );

  const address = useAddress();
  const connect = useMetamask();

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
