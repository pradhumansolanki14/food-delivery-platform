import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Container, BrandLogo, BrandText } from "../ui";
import { BRAND } from "../../constants/brand";

const footerLinks = {
  Company: [
    { label: "About Us", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Press & News", path: "/press" },
    { label: `${BRAND.NAME} Blog`, path: "/blog" }
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
    { label: "Become a Partner", path: "/become-a-partner" }
  ],
};

const Footer = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (heading) => {
    setOpenSections((prev) => ({
      ...prev,
      [heading]: !prev[heading],
    }));
  };

  return (
    <footer className="bg-slate-950 text-slate-400" id="footer">
      {/* ── Main Footer Link Columns ── */}
      <div className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">
            {/* Brand Information column */}
            <div className="md:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-2.5 group">
                <BrandLogo size={30} className="group-hover:scale-105" />
                <BrandText className="text-3xl text-white [&>span]:text-emerald-450 [&>span:first-child]:text-white" />
              </Link>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-xs font-semibold">
                Premium food delivery bringing the city&apos;s best dishes directly to your doorstep. Hot, fresh, and hand-delivered with care.
              </p>

              {/* Social Link List */}
              <div className="flex items-center gap-3 pt-1">
                {[
                  { icon: <FaFacebookF size={15} />, label: "Facebook", path: "#" },
                  { icon: <FaXTwitter size={15} />, label: "Twitter/X", path: "#" },
                  { icon: <FaInstagram size={15} />, label: "Instagram", path: "#" },
                  { icon: <FaLinkedinIn size={15} />, label: "LinkedIn", path: "#" },
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

            {/* Desktop View Columns (md: and up) */}
            <div className="hidden md:contents">
              {Object.entries(footerLinks).map(([heading, links]) => (
                <div key={heading}>
                  <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">{heading}</h4>
                  <ul className="space-y-3.5">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.path}
                          className="text-sm text-slate-400 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block font-semibold"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Mobile View Collapsible Accordions (< md) */}
            <div className="md:hidden border-t border-slate-900 pt-2 space-y-1">
              {Object.entries(footerLinks).map(([heading, links]) => {
                const isOpen = !!openSections[heading];
                return (
                  <div key={heading} className="border-b border-slate-900/90">
                    <button
                      onClick={() => toggleSection(heading)}
                      className="w-full flex items-center justify-between py-3.5 text-left group focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-white font-bold text-xs uppercase tracking-widest">
                        {heading}
                      </span>
                      <FiChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-emerald-400" : "group-hover:text-white"
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden pb-4 space-y-3 pl-1"
                        >
                          {links.map((link) => (
                            <li key={link.label}>
                              <Link
                                to={link.path}
                                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-block font-semibold"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Bar Details */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-semibold text-center sm:text-left">
              &copy; {new Date().getFullYear()} {BRAND.NAME} Technologies Inc. All rights reserved.
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
