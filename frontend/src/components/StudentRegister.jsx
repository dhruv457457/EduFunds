import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useContract from "../hooks/useContract";
import { useIPFS } from "../hooks/useIPFS";

const StudentRegister = () => {
  const { registerStudent, isLoading: contractLoading, error: contractError } = useContract();
  const { uploadToIPFS, isUploading: ipfsLoading, ipfsError } = useIPFS();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    skills: "",
    portfolioLink: "",
    educationLevel: "",
    graduationYear: "",
  });
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(null); // Clear errors when user types
  };

  const validateForm = () => {
    if (!form.fullName.match(/^[a-zA-Z ]{2,30}$/)) {
      setFormError("Please enter a valid full name (2-30 characters)");
      return false;
    }
    if (!form.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setFormError("Please enter a valid email address");
      return false;
    }
    if (!form.phoneNumber.match(/^\d{10}$/)) {
      setFormError("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      // 1. Upload to IPFS
      const ipfsHash = await uploadToIPFS({
        ...form,
        registrationDate: new Date().toISOString()
      });
  
      if (!ipfsHash) {
        alert("Failed to upload data to IPFS");
        return;
      }
  
      // 2. Register on blockchain with the correct CID
      const txHash = await registerStudent(ipfsHash); // Ensure this stores ONLY the CID
  
      if (txHash) {
        alert(`Registration successful!\nTransaction Hash: ${txHash}`);
        navigate("/profile");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Please check console for details.");
    }
  };

  const isLoading = contractLoading || ipfsLoading;
  const error = formError || contractError || ipfsError;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-indigo-900 mb-6">Student Registration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Fields */}
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
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="1234567890"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="Web Development, Data Science"
              value={form.skills}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Portfolio Link</label>
            <input
              type="url"
              name="portfolioLink"
              placeholder="https://yourportfolio.com"
              value={form.portfolioLink}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Education Level</label>
            <select
              name="educationLevel"
              value={form.educationLevel}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Education Level</option>
              <option value="High School">High School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              placeholder="2024"
              min="1900"
              max="2100"
              value={form.graduationYear}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Processing...
              </span>
            ) : (
              "Register Student"
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentRegister;