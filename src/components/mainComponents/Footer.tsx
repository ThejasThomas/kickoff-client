import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface FooterProps {
  role?: "admin" | "turfOwner" | "client" | "guest";
}

export function Footer({ role = "guest" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">KickOff</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Comfortable turfs. Seamless bookings. Better play{" "}
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/docs"
                  className="text-sm hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="text-sm hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Maradu kochi,Kerala,India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-sm hover:text-white transition-colors"
                >
                  8912445614
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a
                  href="mailto:contact@kickoff.com"
                  className="text-sm hover:text-white transition-colors"
                >
                  contact@kickoff.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Kickoff. All rights reserved.
            </p>
            {role !== "guest" && (
              <p className="text-sm text-gray-400">
                Logged in as{" "}
                <span className="text-white font-medium capitalize">
                  {role}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
