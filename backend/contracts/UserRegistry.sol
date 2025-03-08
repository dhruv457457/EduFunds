// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract UserRegistry is Ownable {
    // Pass the deployer's address as the initial owner
    constructor(address initialOwner) Ownable(initialOwner) {}
    enum UserRole { None, Student, Investor }

    // Student structure
    struct Student {
        string ipfsHash; // IPFS hash for off-chain profile data
        uint256 totalFundsReceived; // Total funds received (in native currency, e.g., ETH)
        address[] earnedNFTs; // List of earned NFT certificates
    }

    // Investor structure
    struct Investor {
        string ipfsHash; // IPFS hash for off-chain profile data
        uint256 totalInvestmentMade; // Total funds invested (in native currency, e.g., ETH)
    }

    // Mappings for user data
    mapping(address => UserRole) public userRoles;
    mapping(address => Student) public students;
    mapping(address => Investor) public investors;

    // Events
    event StudentRegistered(address indexed student, string ipfsHash);
    event InvestorRegistered(address indexed investor, string ipfsHash);
    event FundsUpdated(address indexed user, uint256 amount, bool isStudent);
    event NFTAdded(address indexed student, address indexed nftContract);

    // Register a student
    function registerStudent(string memory _ipfsHash) external {
        require(userRoles[msg.sender] == UserRole.None, "Already registered");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");

        students[msg.sender] = Student({
            ipfsHash: _ipfsHash,
            totalFundsReceived: 0,
            earnedNFTs: new address[](0)
        });

        userRoles[msg.sender] = UserRole.Student;
        emit StudentRegistered(msg.sender, _ipfsHash);
    }

    // Register an investor
    function registerInvestor(string memory _ipfsHash) external {
        require(userRoles[msg.sender] == UserRole.None, "Already registered");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");

        investors[msg.sender] = Investor({
            ipfsHash: _ipfsHash,
            totalInvestmentMade: 0
        });

        userRoles[msg.sender] = UserRole.Investor;
        emit InvestorRegistered(msg.sender, _ipfsHash);
    }

    // Update student funds (only callable by owner)
    function updateStudentFunds(address _student, uint256 _amount) external onlyOwner {
        require(userRoles[_student] == UserRole.Student, "Not a student");
        students[_student].totalFundsReceived += _amount;
        emit FundsUpdated(_student, _amount, true);
    }

    // Update investor funds (only callable by owner)
    function updateInvestorFunds(address _investor, uint256 _amount) external onlyOwner {
        require(userRoles[_investor] == UserRole.Investor, "Not an investor");
        investors[_investor].totalInvestmentMade += _amount;
        emit FundsUpdated(_investor, _amount, false);
    }

    // Add an earned NFT to a student's profile (only callable by owner)
    function addEarnedNFT(address _student, address _nftContract) external onlyOwner {
        require(userRoles[_student] == UserRole.Student, "Not a student");
        students[_student].earnedNFTs.push(_nftContract);
        emit NFTAdded(_student, _nftContract);
    }

    // Get student info
    function getStudentInfo(address _student) external view returns (
        string memory ipfsHash,
        uint256 totalFunds,
        uint256 nftCount
    ) {
        require(userRoles[_student] == UserRole.Student, "Not a student");
        Student storage s = students[_student];
        return (s.ipfsHash, s.totalFundsReceived, s.earnedNFTs.length);
    }

    // Get investor info
    function getInvestorInfo(address _investor) external view returns (
        string memory ipfsHash,
        uint256 totalInvested
    ) {
        require(userRoles[_investor] == UserRole.Investor, "Not an investor");
        Investor storage i = investors[_investor];
        return (i.ipfsHash, i.totalInvestmentMade);
    }

    // Get earned NFTs for a student
    function getEarnedNFTs(address _student) external view returns (address[] memory) {
        require(userRoles[_student] == UserRole.Student, "Not a student");
        return students[_student].earnedNFTs;
    }
}