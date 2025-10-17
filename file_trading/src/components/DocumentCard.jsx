import React from "react";
import { FaFilePdf, FaFileImage, FaFileAlt, FaFileWord, FaFileExcel } from "react-icons/fa";
import { useMarketplace } from "../contexts/MarketplaceContext";

// Determine icon based on file extension
const getFileIcon = (ext) => {
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

const DocumentCard = ({ doc, url, showBuy = true }) => {
  const { account, buyDocument, listForSale } = useMarketplace();
  const isOwner = account?.toLowerCase() === doc.owner.toLowerCase();
  const ext = doc.name?.split(".").pop().toLowerCase() || "";
  const [newPrice, setNewPrice] = React.useState(doc.price || "0");

  const handleBuy = async () => {
    if (!doc.price || doc.price === "0") return alert("Document not for sale!");
    await buyDocument(doc.tokenId, parseFloat(doc.price));
  };

  const handleListForSale = async () => {
    if (!newPrice || newPrice === "0") return alert("Please enter a selling price greater than 0.");
    await listForSale(doc.tokenId, parseFloat(newPrice));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition w-[40%]">
      <div className="flex items-center gap-3 mb-3">
        {getFileIcon(ext)}
        <h3 className="font-bold text-lg text-gray-800">{doc.name || `Document #${doc.tokenId}`}</h3>
      </div>

      <p className="text-gray-600 mb-1 text-wrap w-full">
        <span className="font-semibold text-wrap w-full">Owner: </span> 
        <p className="w-full text-wrap">{doc.owner}</p>
      </p>
      <p className="text-gray-600 mb-1 text-wrap">
        <span className="font-semibold ">Preview:</span>
      </p>
      <p className="text-gray-600 mb-1 break-all w-full">
        <span className="font-semibold">URI:</span>{" "}
        <a href={`${url}${doc.uri}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-wrap w-full">
          {doc.uri}
        </a>
      </p>
      <p className="text-gray-600 mb-3">
        <span className="font-semibold">Price:</span>{" "}
        {doc.price && doc.price !== "0" ? doc.price + " ETH" : "Not for sale"}
        {
          isOwner && doc.price == "0" ? (
            <div className="mt-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Set price in ETH"
              />
              <button
                onClick={handleListForSale}
                className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                List for Sale
              </button>
            </div>
          ) : null // Only show input if owner and not for sale
          
        }
      </p>

      {showBuy && !isOwner && doc.forSale && doc.price !== "0" && (
        <button
          onClick={handleBuy}
          className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Buy
        </button>
      )}
    </div>
  );
};

export default DocumentCard;
