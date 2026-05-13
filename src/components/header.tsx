'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header style={{ 
      padding: '1rem 2rem', 
      backdropFilter: 'blur(10px)', 
      backgroundColor: '#11192840',
      position: 'sticky',
      width: '100%',
      top: 0,
      zIndex: 10,
      fontFamily: 'var(--font-geist-sans)',  // matches the rest of the site
      fontSize: '1.2rem',
    }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/hkn-logo.svg"
            alt="HKN Logo" 
            width={70}
            height={70}
          />
        </Link>

        {/* Navigation Links Section */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/projects" style={{ color: pathname === '/projects' ? '#5f69a6' : '#bfdbfee6', textDecoration: 'none' }}>All Projects</Link>
          <Link href="/resources" style={{ color: pathname === '/resources' ? '#5f69a6' : '#bfdbfee6', textDecoration: 'none' }}>Resources</Link>
          <Link href="/showcase" style={{ color: pathname === '/showcase' ? '#5f69a6' : '#bfdbfee6', textDecoration: 'none' }}>Showcase</Link>
        </div>
      </nav>
    </header>
  );
}
