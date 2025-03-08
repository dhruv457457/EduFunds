const ProfileCard = ({ userData, userType }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Profile</h1>
      <div className="space-y-4">
        <p><strong>Name:</strong> {userData.fullName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phoneNumber}</p>

        {userType === "student" && (
          <>
            <p><strong>Date of Birth:</strong> {userData.dateOfBirth}</p>
            <p><strong>Skills:</strong> {userData.skills}</p>
            <p><strong>Portfolio:</strong> <a href={userData.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{userData.portfolioLink}</a></p>
            <p><strong>Education Level:</strong> {userData.educationLevel}</p>
            <p><strong>Graduation Year:</strong> {userData.graduationYear}</p>
            <p><strong>Total Funds Received:</strong> {userData.totalFundsReceived} ETH</p>
            <p><strong>Earned NFTs:</strong> {userData.earnedNFTs.join(", ")}</p>
            <p><strong>Previous Transactions:</strong> {userData.previousTransactions.join(", ")}</p>
          </>
        )}

        {userType === "investor" && (
          <>
            <p><strong>Company:</strong> {userData.companyName}</p>
            <p><strong>Investment Interest:</strong> {userData.investmentInterest}</p>
            <p><strong>Preferred Investment Amount:</strong> {userData.preferredInvestmentAmount} ETH</p>
            <p><strong>Investment Experience:</strong> {userData.investmentExperience}</p>
            <p><strong>Total Investment Made:</strong> {userData.totalInvestmentMade} ETH</p>
            <p><strong>EduToken Balance:</strong> {userData.eduTokenBalance} EDU</p>
            <p><strong>Previous Transactions:</strong> {userData.previousTransactions.join(", ")}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;