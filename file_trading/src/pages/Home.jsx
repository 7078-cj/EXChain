import React from "react";
import { useMarketplace } from "../contexts/MarketplaceContext";
import MintForm from "../components/MintForm";
import { ethers } from "ethers";
import DocumentList from "../components/DocumentList";

function Home() {
  const { allDocs } = useMarketplace();
  console.log("All Docs:", allDocs);
  const url = import.meta.env.VITE_BUCKET_URL;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Document Marketplace</h1>

      {/* Minting Form */}
      <MintForm />

      <h2 className="text-xl font-semibold mt-6 mb-2">All Documents</h2>

  
        
      <DocumentList  allDocs={allDocs} url={url} />
   
    </div>
  );
}

export default Home;
