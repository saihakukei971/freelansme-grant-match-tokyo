import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header-gradient text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0 flex items-center">
            {/* Reactロゴ */}
            <svg className="h-8 w-8 mr-2 react-logo-spin" viewBox="0 0 841.9 595.3" fill="#61DAFB">
              <g>
                <path d="M666.3,296.5c0-32.5-40.7-63.3-103.1-82.4c14.4-63.6,8-114.2-20.2-130.4c-6.5-3.8-14.1-5.6-22.4-5.6v22.3
                c4.6,0,8.3,0.9,11.4,2.6c13.6,7.8,19.5,37.5,14.9,75.7c-1.1,9.4-2.9,19.3-5.1,29.4c-19.6-4.8-41-8.5-63.5-10.9
                c-13.5-18.5-27.5-35.3-41.6-50c32.6-30.3,63.2-46.9,84-46.9l0-22.3c0,0-27.5,0-68.6,29.8c-13.9,15.5-28.1,33.1-42.5,52.4
                c-73.5,5.1-146,22.2-201.7,54.4c-7.8-26.5-12.1-51-12.1-73.1c0-38.2,6.5-68.7,20.1-86.8c12.7-16.9,30.3-25.6,51.4-25.6l0-22.3
                c0,0-24,0-47.8,16.1c-22.7,15.5-37.4,43.9-37.4,86.3c0,25.5,4.4,53.9,13,84.8c-42.5,24.3-78.3,59.8-98.5,101.8
                c-27.5,57.6-21.9,106.6,14.3,128.1c6.5,3.8,14.1,5.6,22.5,5.6c27.5,0,63.5-19.6,99.9-53.6c36.4,33.8,72.4,53.2,99.9,53.2
                c8.4,0,16-1.8,22.6-5.6c28.1-16.2,34.4-66.7,19.9-130.1C625.8,359.7,666.3,328.9,666.3,296.5z M536.1,368.8
                c-3.7,12.9-8.3,26.2-13.5,39.5c-4.1-8-8.4-16-13.1-24c-4.6-8-9.5-15.8-14.4-23.4C509.3,361,523,365.2,536.1,368.8z
                M490.3,336.3c5.4,9.2,10.5,19,15.3,29.2c4.7,10.3,9,20.8,12.9,31.3c-14.9,3.5-30.1,6.2-45.6,8.2c-2.4-15.7-6-31.8-10.6-48
                C471.5,350.3,481.2,343.3,490.3,336.3z M439.8,285.9c3.7,4.1,7.4,8.5,11.1,13.3c3.7,4.8,7.3,9.7,10.7,14.8
                c-10.8-0.5-21.7-0.7-32.6-0.7c-11,0-21.8,0.3-32.6,0.7C403.5,304.9,420.9,293.2,439.8,285.9z M350.3,335
                c-9.2,7-18.9,14-28.1,20.7c-4.6-16.2-8.2-32.3-10.6-48c15.4,2,30.6,4.8,45.6,8.2C353.5,324.2,351.8,329.6,350.3,335z
                M347.2,256.1c-5.5,9.3-10.5,19-15.3,29.3c-4.8,10.3-9,20.8-12.9,31.3c-14.9-3.6-28.6-7.7-41.3-12.2
                c4.9-7.6,9.8-15.4,14.4-23.4C297.9,272.1,322.3,261.7,347.2,256.1z M420.7,163c18.6,20.1,34.6,43.9,47.1,70.4
                c-12.7,2.3-25.8,4.1-39.1,5.2C426.4,212,425.3,186.4,420.7,163z M346.7,162c-4.6,23.5-5.7,49.2-7.8,74.8
                c-13.3-1.2-26.3-3-39-5.2C312.1,205.7,328.1,183.1,346.7,162z M320.8,203.6c13.5,18.8,27.5,35.6,41.6,50
                c-13.9,0.8-27.9,1.2-41.9,1.2c-14,0-28-0.4-41.9-1.2C293.4,239.2,307.3,222.4,320.8,203.6L320.8,203.6z"></path>
                <circle cx="420.9" cy="296.5" r="45.7" fill="#61DAFB"></circle>
              </g>
            </svg>
            <Link to="/" className="text-2xl font-bold hover:text-blue-100 transition-colors flex items-center">
              補助金ファインダー
              <span className="ml-2 bg-blue-800 text-white text-xs px-2 py-1 rounded-full">React</span>
            </Link>
          </div>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className="hover:text-blue-100 transition-colors text-sm sm:text-base flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  ホーム
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.jgrants-portal.go.jp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-100 transition-colors text-sm sm:text-base flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  jGrants公式
                </a>
              </li>
              <li>
                <a 
                  href="https://www.metro.tokyo.lg.jp/information/press/2024/04" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-100 transition-colors text-sm sm:text-base flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
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
