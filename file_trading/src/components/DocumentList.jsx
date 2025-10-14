import React from "react";
import DocumentCard from "./DocumentCard";

const DocumentList = ({ allDocs, url }) => {
  return (
    <div className="mt-6">
      {allDocs.length === 0 ? (
        <p className="text-gray-500">No documents found.</p>
      ) : (
        allDocs.map((doc, index) => (
          <DocumentCard key={index} doc={doc} url={url} />
        ))
      )}
    </div>
  );
};

export default DocumentList;
