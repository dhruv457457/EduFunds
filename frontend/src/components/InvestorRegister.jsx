import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import useContract from "../hooks/useContract";
import { useIPFS } from "../hooks/useIPFS";

const InvestorRegister = () => {
  const { uploadToIPFS, isUploading: ipfsLoading, ipfsError } = useIPFS()
  const { registerInvestor, isLoading, error } = useContract();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    investmentInterest: "",
    preferredInvestmentAmount: "",
    investmentExperience: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateInvestmentAmount = (amount) => {
    const value = parseFloat(amount);
    return !isNaN(value) && value > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInvestmentAmount(form.preferredInvestmentAmount)) {
      alert("Please enter a valid investment amount");
      return;
    }

    try {
      // Upload to IPFS
      const ipfsData = {
        ...form,
        registrationDate: new Date().toISOString(),
        investmentAmount: form.preferredInvestmentAmount
      };
      
      const ipfsHash = await uploadToIPFS(ipfsData);
      if (!ipfsHash) {
        alert("Failed to upload data to IPFS");
        return;
      }

      // Register with IPFS hash
      const txHash = await registerInvestor(ipfsHash);
      if (txHash) {
        alert(`Investor registered! TX Hash: ${txHash}`);
        navigate("/profile");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Please check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Investor Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="123-456-7890"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                name="companyName"
                placeholder="Acme Corp"
                value={form.companyName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Investment Focus</label>
              <input
                type="text"
                name="investmentInterest"
                placeholder="Web3, AI, FinTech"
                value={form.investmentInterest}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Investment Amount (ETH)</label>
              <input
                type="number"
                name="preferredInvestmentAmount"
                placeholder="100"
                value={form.preferredInvestmentAmount}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="0.1"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Investment Experience</label>
            <textarea
              name="investmentExperience"
              placeholder="Describe your investment experience..."
              value={form.investmentExperience}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || ipfsLoading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ipfsLoading && "📤 Uploading to IPFS..."}
            {!ipfsLoading && isLoading && "⛓ Processing Blockchain Transaction..."}
            {!ipfsLoading && !isLoading && "🚀 Register Investor"}
          </button>

          {(error || ipfsError) && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              <p className="font-medium">Error:</p>
              <p>{error || ipfsError}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InvestorRegister;