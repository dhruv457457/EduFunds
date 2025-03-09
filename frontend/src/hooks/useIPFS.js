import { useState } from 'react';
import axios from 'axios';

export const useIPFS = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsError, setIpfsError] = useState(null);

  const uploadToIPFS = async (data) => {
    try {
      setIsUploading(true);
      setIpfsError(null);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          pinataContent: data,
          pinataMetadata: {
            name: 'edufund-data.json',
            keyvalues: {
              app: 'edufund',
              timestamp: Date.now().toString()
            }
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': '6d591084a29fb4a99861',
            'pinata_secret_api_key': '0f239a7e96449068287982cd9fbc71798f8907cd608aaa86c4d538753e76ab0a'
          },
          timeout: 15000
        }
      );

      // Return ONLY the CID (not a custom string)
      return response.data.IpfsHash; // Example: "QmPNEi4yf9usBH747BGzzZdGNJpVDfao8MG1k8SeA2UbfA"
    } catch (error) {
      setIpfsError(error.response?.data?.error?.details || error.message || 'IPFS upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const fetchFromIPFS = async (ipfsHash) => {
    try {
      if (!ipfsHash) {
        throw new Error('No IPFS hash provided');
      }
  
      // Remove 'ipfs://' prefix if present
      const sanitizedHash = ipfsHash.replace('ipfs://', '');
  
      // Extract the actual CID (Qm... or bafy...)
      const cid = sanitizedHash.startsWith('Qm') || sanitizedHash.startsWith('bafy') 
        ? sanitizedHash 
        : sanitizedHash.split('/').pop();
  
      if (!cid || (!cid.startsWith('Qm') && !cid.startsWith('bafy'))) {
        throw new Error(`Invalid IPFS CID format: ${ipfsHash}`);
      }
  
      console.log('Fetching from IPFS with CID:', cid);
  
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${cid}`,
        { 
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        }
      );
  
      return typeof response.data === 'string' 
        ? JSON.parse(response.data)
        : response.data;
  
    } catch (error) {
      console.error('IPFS fetch failed:', error);
      throw new Error(`IPFS fetch failed: ${error.message}`);
    }
  };

  return { 
    uploadToIPFS, 
    fetchFromIPFS, 
    isUploading, 
    ipfsError,
    clearError: () => setIpfsError(null)
  };
};