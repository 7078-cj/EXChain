// src/components/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useMarketplace } from "../contexts/MarketplaceContext";

const Header = () => {
  const { account, connectWallet } = useMarketplace();
  const location = useLocation();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-2xl font-extrabold text-gray-800">
          <Link to="/">FileTrade</Link>
        </div>

        <nav className="flex gap-6 text-gray-700 font-medium">
          <Link
            to="/"
            className={`hover:text-blue-600 ${
              location.pathname === "/" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/profile"
            className={`hover:text-blue-600 ${
              location.pathname === "/profile" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
            }`}
          >
            Profile
          </Link>
        </nav>

        <div>
          {account ? (
            <span className="bg-blue-50 text-blue-700 font-mono px-3 py-1 rounded-full">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
