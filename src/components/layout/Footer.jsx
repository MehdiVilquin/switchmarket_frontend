import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link
              href="/"
              className="text-xl font-semibold text-gray-800 flex items-center mb-4"
            >
              <span className="text-black mr-1">Switch Market </span>
            </Link>
            <p className="text-gray-600 mb-6">
              Helping you make informed choices about your beauty products for a
              healthier you and planet.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Products</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/SearchProducts"
                    className="text-gray-600 hover:text-emerald-500 transition-colors"
                  >
                    Search Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contribute"
                    className="text-gray-600 hover:text-emerald-500 transition-colors"
                  >
                    Contribute
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Discover"
                    className="text-gray-600 hover:text-emerald-500 transition-colors"
                  >
                    Discover
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/additives"
                    className="text-gray-600 hover:text-emerald-500 transition-colors"
                  >
                    Additives Library
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} SwitchMarket. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/terms"
              className="text-gray-500 hover:text-emerald-500 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-emerald-500 transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
