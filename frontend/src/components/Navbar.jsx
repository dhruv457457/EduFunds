import { Link } from "react-router-dom";
import useContract from "../hooks/useContract";

const Navbar = () => {
  const { account, connectWallet, isLoading, error } = useContract();

  return (
    <nav className="bg-indigo-900 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">EduFund</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
      </div>
      
      <div className="flex items-center gap-4">
        {error && (
          <span className="text-red-300 text-sm">{error}</span>
        )}
        
        {account ? (
          <span className="bg-gray-800 px-4 py-2 rounded">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="bg-white text-indigo-900 px-4 py-2 rounded font-semibold hover:bg-indigo-50 transition disabled:opacity-50"
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;