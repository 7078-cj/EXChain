import React, { useState } from "react";
import { useMarketplace } from "../contexts/MarketplaceContext";

const MintForm = () => {
  const { mintDocument } = useMarketplace();

  const [file, setFile] = useState(null);
  const [price, setPrice] = useState("");
  const [royalty, setRoyalty] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [message, setMessage] = useState("");
  const url = import.meta.env.VITE_BUCKET_URL;

  // ------------------------------
  // Upload file to FastAPI
  // ------------------------------
  const uploadFileToServer = async () => {
    if (!file) throw new Error("Please select a file first.");

    setIsUploading(true);
    setMessage("Uploading file...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${url}upload/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setMessage("✅ File uploaded successfully!");
      return data.uri; // ✅ return the uploaded file URI
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setMessage("❌ Upload failed. Try again.");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // ------------------------------
  // Mint document on blockchain
  // ------------------------------
  const handleMint = async () => {
    if (!file) return alert("Please select a file first!");
    if (!price || !royalty) return alert("Please fill in all fields!");

    setIsMinting(true);
    setMessage("");

    try {
      // 1️⃣ Upload file first and get URI
      const uploadedUri = await uploadFileToServer();

      // 2️⃣ Mint document using uploaded URI
      await mintDocument(uploadedUri, Number(royalty), parseFloat(price));

      setMessage("🎉 Document minted successfully!");

      // Reset form
      setFile(null);
      setPrice("");
      setRoyalty("");
    } catch (err) {
      console.error("❌ Mint failed:", err);
      setMessage("❌ Minting failed. Check console for details.");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-2xl border border-gray-200 mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">📄 Mint a New Document</h2>

      {/* File Input */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full mb-3 border rounded px-3 py-2"
      />

      {/* Input Fields */}
      <div className="mt-5 space-y-3">
        <input
          type="number"
          placeholder="Royalty (basis points, e.g. 250 = 2.5%)"
          value={royalty}
          onChange={(e) => setRoyalty(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="List Price (ETH)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={isMinting || isUploading}
        className={`mt-4 w-full py-2 rounded text-white ${
          isMinting || isUploading
            ? "bg-gray-400"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isUploading
          ? "Uploading..."
          : isMinting
          ? "Minting on-chain..."
          : "Mint Document"}
      </button>

      {/* Status Message */}
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default MintForm;
