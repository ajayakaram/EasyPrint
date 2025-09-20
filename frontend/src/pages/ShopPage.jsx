import React from "react";
import { useParams } from "react-router-dom";
import UploadForm from "../components/UploadForm.jsx";

const ShopPage = () => {
  const { shopId } = useParams(); // this is the adminToken from the URL
  return (
    <div>
      <h1>Upload your document</h1>
      <UploadForm adminToken={shopId} />
    </div>
  );
};

export default ShopPage;

