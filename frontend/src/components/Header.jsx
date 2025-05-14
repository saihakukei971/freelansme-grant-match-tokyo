import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <Link to="/" className="text-2xl font-bold hover:text-blue-100 transition-colors">
              補助金ファインダー
            </Link>
          </div>

          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-100 transition-colors text-sm sm:text-base"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <a
                  href="https://www.jgrants-portal.go.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-100 transition-colors text-sm sm:text-base"
                >
                  jGrants公式
                </a>
              </li>
              <li>
                <a
                  href="https://www.sangyo-rodo.metro.tokyo.lg.jp/chushou/shoko/sougyou/josei/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-100 transition-colors text-sm sm:text-base"
                >
                  東京都補助金
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;