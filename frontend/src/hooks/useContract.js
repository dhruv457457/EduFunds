
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../contracts/UserRegistry.json";

const CONTRACT_ADDRESS = "0x9948a4ED4053916F249296C2D145362562569368";

const useContract = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Ethereum provider and contract
  useEffect(() => {
    const initEthereum = async () => {
      if (!window.ethereum) {
        setError("Please install MetaMask!");
        return;
      }

      try {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const ethSigner = await ethProvider.getSigner();
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI.abi,
          ethSigner
        );

        // Set initial states
        setProvider(ethProvider);
        setSigner(ethSigner);
        setContract(contractInstance);

        // Check existing connection
        const accounts = await ethProvider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        }

        // Setup event listeners
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

      } catch (error) {
        handleError("Initialization failed:", error);
      }
    };

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0]?.address || null);
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    initEthereum();
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // Connect wallet handler
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const ethSigner = await ethProvider.getSigner();
      
      setAccount(accounts[0]);
      setProvider(ethProvider);
      setSigner(ethSigner);
      
    } catch (error) {
      handleError("Connection failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generic contract interaction method
  const callContractMethod = async (methodName, ...args) => {
    if (!contract) {
      setError("Contract not initialized");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const method = contract[methodName];
      const gasLimit = await method.estimateGas(...args);
      
      const tx = await method(...args, { 
        gasLimit: gasLimit * 2n 
      });
      
      const receipt = await tx.wait();
      
      if (receipt.status !== 1) throw new Error("Transaction reverted");
      return receipt.hash;

    } catch (error) {
      handleError(`Transaction failed (${methodName}):`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced error handler
  const handleError = (context, error) => {
    let message = error.reason || error.message;
    
    // Handle common errors
    if (error.code === "ACTION_REJECTED") {
      message = "Transaction rejected by user";
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      message = "Insufficient funds for transaction";
    } else if (error.reason) {
      message = error.reason;
    }

    // Filter expected errors
    const ignoredErrors = ["Not a student", "Not an investor"];
    if (!ignoredErrors.some(e => message.includes(e))) {
      setError(message);
    }

    console.error(context, error);
  };

  // Contract-specific methods
  const getStudentInfo = async (address) => {
    if (!contract) return null;
    try {
      const result = await contract.getStudentInfo.staticCall(address);
      return {
        ipfsHash: result[0],
        totalFunds: result[1].toString(),
        nftCount: Number(result[2])
      };
    } catch (error) {
      handleError("Student info fetch failed:", error);
      return null;
    }
  };

  const getInvestorInfo = async (address) => {
    if (!contract) return null;
    try {
      const result = await contract.getInvestorInfo.staticCall(address);
      return {
        ipfsHash: result[0],
        totalInvested: result[1].toString()
      };
    } catch (error) {
      handleError("Investor info fetch failed:", error);
      return null;
    }
  };

  return {
    // State
    contract,
    provider,
    signer,
    account,
    isLoading,
    error,
    
    // Methods
    connectWallet,
    registerStudent: (ipfsHash) => callContractMethod("registerStudent", ipfsHash),
    registerInvestor: (ipfsHash) => callContractMethod("registerInvestor", ipfsHash),
    getStudentInfo,
    getInvestorInfo,
    getEarnedNFTs: async (address) => {
      try {
        return await contract.getEarnedNFTs.staticCall(address);
      } catch (error) {
        handleError("NFT fetch failed:", error);
        return [];
      }
    },
    updateStudentFunds: (address, amount) => 
      callContractMethod("updateStudentFunds", address, amount),
    updateInvestorFunds: (address, amount) => 
      callContractMethod("updateInvestorFunds", address, amount)
  };
};

export default useContract;