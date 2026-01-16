import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-xl flex items-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0" stopColor="#2563eb" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <rect x="2" y="3" width="20" height="18" rx="4" fill="url(#g1)" />
            <path
              d="M6 8h12M6 12h12M6 16h8"
              stroke="#fff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-gray-800">TextilApp</span>
        </Link>

        {/* This will be dynamic later */}
        <div>
          <Link href="/login" className="text-gray-600 hover:text-blue-600">
            Iniciar sesión
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
