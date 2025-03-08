import express from 'express';
import axios from 'axios';
const router = express.Router();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

router.post('/upload', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        pinataContent: req.body,
        pinataMetadata: { name: 'profile-data.json' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY
        }
      }
    );
    
    res.json({ ipfsHash: `ipfs://${response.data.IpfsHash}` });
  } catch (error) {
    res.status(500).json({ error: 'IPFS upload failed' });
  }
});

router.get('/fetch', async (req, res) => {
  try {
    const cid = req.query.cid.replace('ipfs://', '');
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'IPFS fetch failed' });
  }
});

export default router;