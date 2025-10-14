import React, { useEffect, useState } from "react";
import { useMarketplace } from "../contexts/MarketplaceContext";
import DocumentCard from "../components/DocumentCard";

const Profile = () => {
  const { myDocs, fetchDocuments, account, contract, withdrawProceeds } = useMarketplace();
  const [proceeds, setProceeds] = useState("0"); // Withdrawable balance
  const url = import.meta.env.VITE_BUCKET_URL;

  // Refresh documents and proceeds on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch withdrawable balance
  useEffect(() => {
    const fetchProceeds = async () => {
      if (contract && account) {
        try {
          const amount = await contract.proceeds(account);
          setProceeds(amount ? ethers.formatEther(amount) : "0");
        } catch (err) {
          console.error("❌ Failed to fetch proceeds:", err);
        }
      }
    };
    fetchProceeds();
  }, [contract, account]);

  return (
    <div className="max-w-6xl mx-auto p-6">
  <h1 className="text-3xl font-bold mb-4 text-gray-800">My Profile</h1>

  {account ? (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <span className="text-gray-700 font-mono">Wallet: {account}</span>
        <span className="text-gray-700 font-semibold">Withdrawable: {proceeds} ETH</span>
        <button
          onClick={withdrawProceeds}
          className="bg-yellow-500 text-white px-5 py-2 rounded-xl hover:bg-yellow-600 transition"
        >
          Withdraw Proceeds
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Documents</h2>
      {myDocs.length === 0 ? (
        <p className="text-gray-600">You don’t own any documents yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myDocs.map((doc) => (
            <DocumentCard key={doc.tokenId} doc={doc} url={url} showBuy={false} />
          ))}
        </div>
      )}
    </>
  ) : (
    <p className="text-gray-600">Please connect your wallet to view your profile.</p>
  )}
</div>

  );
};

export default Profile;
