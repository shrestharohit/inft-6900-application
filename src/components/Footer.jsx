import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-800 text-white py-5 text-center mt-auto">
        <div className="flex justify-center gap-5">
          <Link
            to="/about"
            className="text-white no-underline text-base hover:text-gray-300 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-white no-underline text-base hover:text-gray-300 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/terms"
            className="text-white no-underline text-base hover:text-gray-300 transition-colors"
          >
            Terms & Conditions
          </Link>
        </div>
        <div className="mt-2.5 text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} BrainWave. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
