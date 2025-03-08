import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  BookOpenIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const [activeTab, setActiveTab] = useState("students");

  const features = [
    {
      title: "Skill-Based Funding",
      desc: "Get education funded by completing real-world tasks",
      icon: BookOpenIcon,
    },
    {
      title: "Smart Contract Escrow",
      desc: "Secure, transparent funding agreements on blockchain",
      icon: ShieldCheckIcon,
    },
    {
      title: "NFT Reputation System",
      desc: "Build verifiable work history through NFT certificates",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Investor Liquidity",
      desc: "Trade or stake EduTokens for flexible returns",
      icon: BriefcaseIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-indigo-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Decentralized Education Financing
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Fund your education through skill-based work, not loans
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/profile"
              className="bg-white text-indigo-900 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Key Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How EduFund Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Simple 5-Step Process
          </h2>
          <div className="grid md:grid-cols-5 gap-8">
            {["Apply", "Get Funded", "Complete Tasks", "Earn NFTs", "Grow Reputation"].map(
              (step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full text-white flex items-center justify-center mx-auto mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold">{step}</h3>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">1.2k+</div>
            <div className="opacity-80">Students Funded</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">$4.8M+</div>
            <div className="opacity-80">In Education Funding</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">15k+</div>
            <div className="opacity-80">Tasks Completed</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Journey</h2>
          <div className="flex gap-6 justify-center">
            <Link
              to="/profile"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            >
              I'm a Student
            </Link>
            <Link
              to="/profile"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition"
            >
              I'm an Investor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;