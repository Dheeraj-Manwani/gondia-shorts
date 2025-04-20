import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="about" className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-2xl font-bold font-montserrat mb-4">
              <span className="text-primary">Gondia</span>{" "}
              <span className="text-secondary">Shorts</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your quick news update from Gondia—swipe and read.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
                onClick={(e) => e.preventDefault()}
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
                onClick={(e) => e.preventDefault()}
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
                onClick={(e) => e.preventDefault()}
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Youtube"
                onClick={(e) => e.preventDefault()}
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Download
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition-colors"
                ></Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-primary mt-1" />
                <span className="text-gray-400">
                  123 Civil Lines, Gondia, Maharashtra, India
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <span className="text-gray-400">info@gondiashorts.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary" />
                <span className="text-gray-400">+91 1234567890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Gondia Shorts. All rights reserved.
            </p>
            <div className="flex justify-center mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white mx-2 transition-colors text-sm"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white mx-2 transition-colors text-sm"
                onClick={(e) => e.preventDefault()}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white mx-2 transition-colors text-sm"
                onClick={(e) => e.preventDefault()}
              >
                Cookies Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
