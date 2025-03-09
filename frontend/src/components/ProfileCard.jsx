import PropTypes from 'prop-types';

const ProfileCard = ({ userData, userType }) => {
  // Safely destructure with defaults
  const {
    fullName = 'N/A',
    email = 'N/A',
    phoneNumber = 'N/A',
    dateOfBirth = 'N/A',
    skills = 'None listed',
    portfolioLink = '',
    educationLevel = 'N/A',
    graduationYear = 'N/A',
    companyName = 'N/A',
    investmentInterest = 'N/A',
    investmentExperience = 'No experience listed',
    totalFundsReceived = 0,
    totalInvestmentMade = 0,
    preferredInvestmentAmount = 0,
    eduTokenBalance = 0,
    earnedNFTs = [],
    previousTransactions = []
  } = userData || {};

  // Safely handle URLs
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Profile</h1>
      <div className="space-y-4">
        <p><strong>Name:</strong> {fullName}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phoneNumber}</p>

        {userType === "student" ? (
          <>
            <p><strong>Date of Birth:</strong> {dateOfBirth}</p>
            <p><strong>Skills:</strong> {skills}</p>
            <p><strong>Portfolio:</strong> {
              portfolioLink && isValidUrl(portfolioLink) ? (
                <a 
                  href={portfolioLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline"
                >
                  {portfolioLink}
                </a>
              ) : 'N/A'
            }</p>
            <p><strong>Education Level:</strong> {educationLevel}</p>
            <p><strong>Graduation Year:</strong> {graduationYear}</p>
            <p><strong>Total Funds Received:</strong> {totalFundsReceived} ETH</p>
            <p><strong>Earned NFTs:</strong> {
              earnedNFTs.length > 0 ? earnedNFTs.join(", ") : 'None'
            }</p>
          </>
        ) : (
          <>
            <p><strong>Company:</strong> {companyName}</p>
            <p><strong>Investment Interest:</strong> {investmentInterest}</p>
            <p><strong>Preferred Investment Amount:</strong> {preferredInvestmentAmount} ETH</p>
            <p><strong>Investment Experience:</strong> {investmentExperience}</p>
            <p><strong>Total Investment Made:</strong> {totalInvestmentMade} ETH</p>
            <p><strong>EduToken Balance:</strong> {eduTokenBalance} EDU</p>
          </>
        )}
        
        <p><strong>Previous Transactions:</strong> {
          previousTransactions.length > 0 ? previousTransactions.join(", ") : 'None'
        }</p>
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  userData: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    dateOfBirth: PropTypes.string,
    skills: PropTypes.string,
    portfolioLink: PropTypes.string,
    educationLevel: PropTypes.string,
    graduationYear: PropTypes.string,
    companyName: PropTypes.string,
    investmentInterest: PropTypes.string,
    investmentExperience: PropTypes.string,
    totalFundsReceived: PropTypes.number,
    totalInvestmentMade: PropTypes.number,
    preferredInvestmentAmount: PropTypes.number,
    eduTokenBalance: PropTypes.number,
    earnedNFTs: PropTypes.arrayOf(PropTypes.string),
    previousTransactions: PropTypes.arrayOf(PropTypes.string)
  }),
  userType: PropTypes.oneOf(['student', 'investor']).isRequired
};

ProfileCard.defaultProps = {
  userData: null
};

export default ProfileCard;