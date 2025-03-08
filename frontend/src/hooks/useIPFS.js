import { useState } from 'react';
import axios from 'axios';

export const useIPFS = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsError, setIpfsError] = useState(null);

  // Verify environment variables
  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY?.toString().trim();
  const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY?.toString().trim();
  
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.error('Pinata API credentials not found in environment variables!');
    console.log('Current environment:', import.meta.env);
  }

  // Validate keys before any operation
  const validateKeys = () => {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Missing Pinata API credentials');
    }
    if (typeof PINATA_API_KEY !== 'string' || typeof PINATA_SECRET_KEY !== 'string') {
      throw new Error('Invalid API key format');
    }
  };

  const uploadToIPFS = async (data) => {
    try {
      setIsUploading(true);
      setIpfsError(null);
      
      validateKeys(); // Check keys before proceeding

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          pinataContent: data,
          pinataMetadata: {
            name: 'profile-data.json',
            keyvalues: { app: 'edufund' }
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_KEY
          },
          timeout: 15000
        }
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      const message = error.response?.data?.error?.details || 
                     error.message || 
                     'IPFS upload failed';
      setIpfsError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Similar validation for fetchFromIPFS
  const fetchFromIPFS = async (ipfsHash) => {
    try {
      validateKeys();
      const cid = ipfsHash.replace('ipfs://', '');
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${cid}`,
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error?.details || 
                     error.message || 
                     'IPFS fetch failed';
      setIpfsError(message);
      return null;
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