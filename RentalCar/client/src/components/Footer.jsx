import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="pt-12 pb-10 border-t-2 border-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* MAIN GRID */}

        <div className="grid md:grid-cols-4 gap-10">
          {/* BRAND */}

          <div>
            <img src={assets.logo} className="h-9" />

            <p className="text-text-muted mt-3 text-sm leading-relaxed">
              Premium car rental service offering a curated fleet of luxury
              vehicles designed to deliver comfort, reliability and
              unforgettable driving experiences.
            </p>
          </div>

          {/* QUICK LINKS */}

          <div className="md:ml-auto">
            <h3 className="text-text-main font-semibold mb-3">Quick Links</h3>

            <ul className="space-y-2 text-text-muted text-sm">
              <li>
                <Link className="hover:text-primary transition" to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link className="hover:text-primary transition" to="/cars">
                  Browse Cars
                </Link>
              </li>

              <li>
                <Link className="hover:text-primary transition" to="/owner">
                  List Your Car
                </Link>
              </li>

              <li>
                <Link className="hover:text-primary transition" to="/about">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}

          <div className="md:ml-auto">
            <h3 className="text-text-main font-semibold mb-3">Resources</h3>

            <ul className="space-y-2 text-text-muted text-sm">
              <li className="hover:text-primary transition cursor-pointer">
                Help Center
              </li>

              <li className="hover:text-primary transition cursor-pointer">
                Privacy Policy
              </li>

              <li className="hover:text-primary transition cursor-pointer">
                Terms of Service
              </li>

              <li className="hover:text-primary transition cursor-pointer">
                Insurance
              </li>
            </ul>
          </div>

          {/* CONTACT */}

          <div className="md:ml-auto">
            <h3 className="text-text-main font-semibold mb-3">Contact</h3>

            <ul className="space-y-2 text-text-muted text-sm">
              <li>Luxury Drive 12</li>
              <li>Belgrade</li>
              <li>+381 60000000</li>
              <li>info@luxrent.com</li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}

        <div className="border-t border-primary/30 mt-10 pt-6">
          {/* BOTTOM */}

          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-text-muted">
            <p>© {new Date().getFullYear()} LuxRent. All rights reserved.</p>

            <div className="flex gap-6 mt-3 md:mt-0">
              <span className="hover:text-primary cursor-pointer">Privacy</span>

              <span className="hover:text-primary cursor-pointer">Terms</span>

              <span className="hover:text-primary cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
