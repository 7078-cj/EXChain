import React from "react";
import DocumentCard from "./DocumentCard";

// Helper to extract file extension from filename
const getExtension = (filename) => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "other";
};

// Group documents by extension
const groupByExtension = (docs) => {
  return docs.reduce((acc, doc) => {
    const ext = getExtension(doc.name);
    if (!acc[ext]) acc[ext] = [];
    acc[ext].push(doc);
    return acc;
  }, {});
};

const DocumentList = ({ allDocs, url }) => {
  const categorizedDocs = groupByExtension(allDocs);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Documents</h2>

      {Object.keys(categorizedDocs).map((ext) => (
        <div key={ext} className="mb-8">
          <h3 className="text-xl font-medium mb-2 capitalize">{ext} Files</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedDocs[ext].map((doc) => (
              <DocumentCard key={doc.tokenId} doc={doc} url={url} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default DocumentList;
