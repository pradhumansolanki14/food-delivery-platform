import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FiMail, FiHeart } from "react-icons/fi";
import { Container } from "../ui";

const footerLinks = {
  Company: [
    { label: "About Us", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Press & News", path: "/press" },
    { label: "Tomato Blog", path: "/blog" }
  ],
  Legal: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Cookie Settings", path: "/cookies" },
    { label: "Refund Policy", path: "/refunds" }
  ],
  Support: [
    { label: "Help Center", path: "/help" },
    { label: "Contact Us", path: "/contact" },
    { label: "Delivery FAQ", path: "/delivery-faq" },
    { label: "Partner with Us", path: "/partner" }
  ],
}

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400" id="footer">
      
      {/* ── Newsletter CTA ── */}
      <div className="bg-slate-900/60 border-b border-slate-900 py-16">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-lg">
              <h3 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                Unlock free delivery on your{" "}
                <span className="text-gradient-emerald font-extrabold">first order</span>
              </h3>
              <p className="text-slate-400 text-sm">Join over 50,000+ local food lovers who receive weekly discounts.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto max-w-md">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <FiMail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full lg:w-72 pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-450 transition-colors"
                />
              </div>
              <button className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 text-white font-bold rounded-2xl text-sm shadow-emerald hover:-translate-y-px active:translate-y-0 transition-all duration-200 whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Main Footer Link Columns ── */}
      <div className="py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            
            {/* Brand Information column */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="font-poppins font-bold text-xl text-white tracking-tight">Tomato</span>
              </Link>
              <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                Premium food delivery bringing the city&apos;s best dishes directly to your doorstep. Hot, fresh, and hand-delivered with care.
              </p>
              
              {/* Social Link List */}
              <div className="flex items-center gap-3">
                {[
                  { icon: <FaFacebookF size={16} />, label: "Facebook", path: "#" },
                  { icon: <FaXTwitter size={16} />, label: "Twitter/X", path: "#" },
                  { icon: <FaInstagram size={16} />, label: "Instagram", path: "#" },
                  { icon: <FaLinkedinIn size={16} />, label: "LinkedIn", path: "#" },
                ].map((s, i) => (
                  <a 
                    key={i} 
                    href={s.path} 
                    aria-label={s.label}
                    className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-550 hover:text-white flex items-center justify-center text-slate-450 hover:scale-105 transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Column Generation */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">{heading}</h4>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a 
                        href={link.path} 
                        className="text-sm text-slate-400 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar Details */}
          <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 flex items-center gap-1">
              &copy; {new Date().getFullYear()} Tomato Inc. All rights reserved. Made with{" "}
              <FiHeart className="text-emerald-500 fill-emerald-500 inline-block animate-pulse" size={12} />{" "}
              for food enthusiasts.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="w-2 h-2 bg-emerald-450 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">All Systems Operational</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
