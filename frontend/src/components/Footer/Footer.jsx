import React from "react";
import { assets } from "../../assets/assets";

const footerLinks = {
  Company: ["About Us", "Careers", "Press", "Blog"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  Support: ["Help Center", "Contact Us", "Delivery FAQ", "Refund Policy"],
}

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400" id="footer">
      {/* Top Wave */}
      <div className="bg-slate-900 py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Get free delivery on your{' '}
                <span className="text-gradient">first order</span>
              </h3>
              <p className="text-slate-400 text-sm">Join 50,000+ happy customers ordering with Tomato</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-400 transition-colors"
              />
              <button className="px-6 py-3.5 btn-primary text-white font-bold rounded-2xl text-sm shadow-orange whitespace-nowrap">
                Get Offer →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-white">Tomato</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs mb-6">
              Premium food delivery from your city's best restaurants. Fast, fresh, and always delicious.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: assets.facebook_icon, label: "Facebook" },
                { icon: assets.twitter_icon, label: "Twitter" },
                { icon: assets.linkedin_icon, label: "LinkedIn" },
              ].map((s, i) => (
                <a key={i} href="#" aria-label={s.label}
                  className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-orange-500 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-slate-700 hover:border-orange-500">
                  <img src={s.icon} alt={s.label} className="w-4 h-4 brightness-0 invert opacity-70" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2026 Tomato Inc. All rights reserved. Made with ❤️ for food lovers.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
