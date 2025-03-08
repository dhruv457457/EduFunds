import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import StudentRegister from "../components/StudentRegister";
import InvestorRegister from "../components/InvestorRegister";
import useContract from "../hooks/useContract";
import { useIPFS } from "../hooks/useIPFS";

const Profile = () => {
  const { account, getStudentInfo, getInvestorInfo, getEarnedNFTs, error: contractError } = useContract();
  const { fetchFromIPFS, error: ipfsError } = useIPFS();
  
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    if (!account) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check student status first
      const studentInfo = await getStudentInfo(account);
      if (studentInfo) {
        const [ipfsData, nfts] = await Promise.all([
          fetchFromIPFS(studentInfo.ipfsHash),
          getEarnedNFTs(account)
        ]);

        setUserData({
          ...ipfsData,
          totalFunds: studentInfo.totalFunds,
          nftCount: studentInfo.nftCount,
          earnedNFTs: nfts
        });
        setUserType("student");
        return;
      }

      // If not student, check investor status
      const investorInfo = await getInvestorInfo(account);
      if (investorInfo) {
        const ipfsData = await fetchFromIPFS(investorInfo.ipfsHash);
        
        setUserData({
          ...ipfsData,
          totalInvested: investorInfo.totalInvested
        });
        setUserType("investor");
        return;
      }

      // If neither, clear data
      setUserData(null);
      setUserType(null);

    } catch (error) {
      if (!error.message.includes("Not a student") && !error.message.includes("Not an investor")) {
        setError("Failed to load profile: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [account]);

  const handleRetry = () => {
    setError(null);
    loadProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900 mx-auto"></div>
          <p className="text-gray-600">Loading your profile...</p>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {(error || contractError || ipfsError) && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">Error:</p>
              <p>{error || contractError || ipfsError}</p>
            </div>
            <button 
              onClick={handleRetry}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Profile Content */}
        {userData ? (
          <ProfileCard userData={userData} userType={userType} />
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                Welcome to EduFund
              </h1>
              <p className="text-gray-600">
                {account ? "Register to get started" : "Connect your wallet to continue"}
              </p>
            </div>

            {!account ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Please connect your wallet to view or create your profile
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Student Registration
                  </h2>
                  <StudentRegister onSuccess={loadProfile} />
                </section>

                <div className="border-t pt-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Investor Registration
                  </h2>
                  <InvestorRegister onSuccess={loadProfile} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;