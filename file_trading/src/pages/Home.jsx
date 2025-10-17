import React from "react";
import { useMarketplace } from "../contexts/MarketplaceContext";
import MintForm from "../components/MintForm";
import { ethers } from "ethers";
import DocumentList from "../components/DocumentList";
import DocumentCard from "../components/DocumentCard";

function Home() {
  const { allDocs } = useMarketplace();
  console.log("All Docs:", allDocs);
  const url = import.meta.env.VITE_BUCKET_URL;

  return (
    <div className="max-w-7xl mx-auto p-6">
  <section className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-50 rounded-2xl p-6 mb-8 shadow">
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-800">Welcome to EXChain</h1>
      <p className="text-gray-700 mb-4">Mint, sell, and buy digital documents securely on-chain.</p>
      <MintForm />
    </div>
    <img src="/Exchain.jpg" alt="Documents" className="w-full md:w-1/2" />
  </section>
  <DocumentList allDocs={allDocs} url={url} />
  
</div>
  );
}

export default Home;
