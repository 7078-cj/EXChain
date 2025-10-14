import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/DocumentMarketplace.json"; 
// Replace with your deployed contract address
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");

  const [allDocs, setAllDocs] = useState([]); // ✅ holds all minted docs
  const [myDocs, setMyDocs] = useState([]);   // ✅ holds only user-owned docs

  // ------------------------------
  // 1️⃣ Connect wallet
  // ------------------------------
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();

    setAccount(addr);
    setBalance(ethers.formatEther(await provider.getBalance(addr)));

    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    setContract(contractInstance);

    console.log("✅ Connected:", addr);
  };

  // ------------------------------
  // 2️⃣ Mint document
  // ------------------------------
  const mintDocument = async (uri, royaltyBps, listPrice) => {
    if (!contract) return alert("Contract not ready");
    try {
      const tx = await contract.mintDocument(
        uri,
        royaltyBps,
        ethers.parseEther(listPrice.toString())
      );
      await tx.wait();
      alert("Document minted successfully!");
      await fetchDocuments(); // refresh docs after mint
    } catch (err) {
      console.error("❌ Mint failed:", err);
    }
  };

  // ------------------------------
  // 3️⃣ List document for sale
  // ------------------------------
  const listForSale = async (tokenId, price) => {
    try {
      const tx = await contract.listForSale(tokenId, ethers.parseEther(price.toString()));
      await tx.wait();
      alert("Listed for sale!");
      await fetchDocuments();
    } catch (err) {
      console.error("❌ List failed:", err);
    }
  };

  // ------------------------------
  // 4️⃣ Buy document
  // ------------------------------
 const buyDocument = async (tokenId, price) => {
  try {
    if (!account || !contract) return alert("Connect wallet first");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const walletBalance = await provider.getBalance(account);

    const value = ethers.parseEther(price.toString());

    if (walletBalance < value) {
      alert("❌ Insufficient funds to buy this document!");
      return;
    }

    const tx = await contract.buy(tokenId, { value });
    await tx.wait();
    alert("🎉 Purchased successfully!");
    await fetchDocuments();
  } catch (err) {
    console.error("❌ Buy failed:", err);

    // Check for common insufficient fund error
    if (err.message.includes("insufficient funds")) {
      alert("❌ Insufficient ETH in your wallet to complete the purchase!");
    } else {
      alert("❌ Purchase failed. Check console for details.");
    }
  }
};

  // ------------------------------
  // 5️⃣ Withdraw proceeds
  // ------------------------------
  const withdrawProceeds = async () => {
    try {
      const tx = await contract.withdrawProceeds();
      await tx.wait();
      alert("Proceeds withdrawn!");
    } catch (err) {
      console.error("❌ Withdraw failed:", err);
    }
  };

 // ------------------------------
// 6️⃣ Fetch all documents
// ------------------------------
const fetchDocuments = async () => {
  if (!contract) return [];
  try {
    const total = Number(await contract.totalSupply());
    const docs = [];

    for (let i = 1; i <= total; i++) {
      const uri = await contract.tokenURI(i);
      const owner = await contract.ownerOf(i);
      const docData = await contract.documents(i);

      // Extract file name from URI
      const name = uri.split("/").pop(); // "filename.ext"

      const formattedPrice = docData.price
        ? ethers.formatEther(docData.price)
        : "0";

      docs.push({
        tokenId: i,
        uri,
        name,            // ✅ added name property
        owner,
        forSale: docData.forSale,
        price: formattedPrice, // formatted string
      });
    }

    setAllDocs(docs);

    if (account) {
      const mine = docs.filter(
        (d) => d.owner.toLowerCase() === account.toLowerCase()
      );
      setMyDocs(mine);
    }

    return docs;
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    return [];
  }
};

  // Auto-refresh on wallet/account change
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  // Refresh docs when account or contract changes
  useEffect(() => {
    if (contract && account) {
      fetchDocuments();
    }
  }, [contract, account]);
  useEffect(() => {
    connectWallet()
    }, [])

  return (
    <MarketplaceContext.Provider
      value={{
        connectWallet,
        mintDocument,
        listForSale,
        buyDocument,
        withdrawProceeds,
        fetchDocuments,
        account,
        balance,
        contract,
        allDocs,
        myDocs, // ✅ Exposed here
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

// Custom hook for easy access
export const useMarketplace = () => useContext(MarketplaceContext);
