import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="pt-28 pb-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* BRAND */}

          <div>
            <img src={assets.logo} className="h-9" />

            <p className="text-text-muted mt-4 text-sm leading-relaxed">
              Premium car rental service offering a curated fleet of luxury
              vehicles designed to deliver comfort, reliability and
              unforgettable driving experiences.
            </p>
          </div>

          {/* LINKS */}

          <div>
            <h3 className="text-text-main font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-2 text-text-muted text-sm">
              <li>
                <Link className="hover:text-gold transition" to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link className="hover:text-gold transition" to="/cars">
                  Browse Cars
                </Link>
              </li>

              <li>
                <Link className="hover:text-gold transition" to="/owner">
                  List Your Car
                </Link>
              </li>

              <li>
                <Link className="hover:text-gold transition" to="/about">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}

          <div>
            <h3 className="text-text-main font-semibold mb-4">Resources</h3>

            <ul className="space-y-2 text-text-muted text-sm">
              <li className="hover:text-gold transition cursor-pointer">
                Help Center
              </li>

              <li className="hover:text-gold transition cursor-pointer">
                Privacy Policy
              </li>

              <li className="hover:text-gold transition cursor-pointer">
                Terms of Service
              </li>

              <li className="hover:text-gold transition cursor-pointer">
                Insurance
              </li>
            </ul>
          </div>

          {/* CONTACT */}

          <div>
            <h3 className="text-text-main font-semibold mb-4">Contact</h3>

            <ul className="space-y-2 text-text-muted text-sm">
              <li>Luxury Drive 12</li>

              <li>Belgrade</li>

              <li>+381 60000000</li>

              <li>info@luxrent.com</li>
            </ul>
          </div>
        </div>

        {/* bottom */}

        <div
          className="mt-16 flex flex-col md:flex-row
            items-center justify-between text-xs text-text-muted"
        >
          <p>© {new Date().getFullYear()} LuxRent. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-gold cursor-pointer">Privacy</span>

            <span className="hover:text-gold cursor-pointer">Terms</span>

            <span className="hover:text-gold cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
