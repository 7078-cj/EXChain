import React from "react";
import { useMarketplace } from "../contexts/MarketplaceContext";
import { FaFilePdf, FaFileImage, FaFileAlt, FaFileWord, FaFileExcel } from "react-icons/fa";

const getFileIcon = (uri) => {
  const ext = uri.split(".").pop().toLowerCase();
  switch (ext) {
    case "pdf":
      return <FaFilePdf className="text-red-600 w-6 h-6" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage className="text-yellow-500 w-6 h-6" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-700 w-6 h-6" />;
    case "xls":
    case "xlsx":
      return <FaFileExcel className="text-green-600 w-6 h-6" />;
    default:
      return <FaFileAlt className="text-gray-500 w-6 h-6" />;
  }
};

const DocumentCard = ({ doc, url }) => {
  const { account, buyDocument } = useMarketplace();

  const handleBuy = async () => {
    if (!doc.forSale) return alert("This document is not for sale");
    if (!doc.price) return alert("Invalid price");

    try {
     buyDocument(doc.tokenId, parseFloat(doc.price));
      
    } catch (err) {
      console.error("❌ Buy failed:", err);
      alert("Purchase failed. Check console.");
    }
  };

  const isOwner = account && account.toLowerCase() === doc.owner.toLowerCase();

  return (
    <div className="border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-2">
        {getFileIcon(doc.uri)}
        <h3 className="font-bold text-lg">Document ID: {doc.tokenId}</h3>
      </div>

      <p>
        <span className="font-semibold">Owner:</span> {doc.owner}
      </p>
      <p>
        <span className="font-semibold">URI:</span>{" "}
        <a
          href={`${url}${doc.uri}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600"
        >
          {doc.uri}
        </a>
      </p>
      <p>
        <span className="font-semibold">List Price:</span>{" "}
        {doc.price && doc.price !== "0" ? doc.price + " ETH" : "Not for sale"}
      </p>

      {/* Buy Button */}
      {!isOwner && doc.forSale && doc.price && doc.price !== "0" && (
        <button
          onClick={handleBuy}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buy Document
        </button>
      )}
    </div>
  );
};

export default DocumentCard;
