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
      position: 'sticky',      // Allows the background content to show through
      width: '100%',
      top: 0,
      zIndex: 10 
    }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/hkn-logo.svg"     // Path to your image in the /public folder
            alt="HKN Logo" 
            width={70}          // Set your desired width
            height={70}         // Set your desired height
          />
        </Link>

        {/* Navigation Links Section */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/projects" style={{ color: pathname === '/projects' ? '#5f69a6' : '#bfdbfee6', textDecoration: 'none' }}>All Projects</Link>
          <Link href="/projects/test-2" style={{ color: pathname === '/projects/test-2' ? '#5f69a6' : '#bfdbfee6', textDecoration: 'none' }}>Individual Project</Link>
          <Link href="/resources" style={{ color: pathname === '/resources' ? '#5f69a6' : '#bfdbfee6', textDecoration: 'none' }}>Resources</Link>
          <Link href="/showcase" style={{ color: pathname === '/showcase' ? '#5f69a6' : '#bfdbfee6', textDecoration: 'none' }}>Showcase</Link>
          <Link href="/admin" style={{ color: pathname === '/admin' ? '#5f69a6' : '#bfdbfee6', textDecoration: 'none' }}>Admin</Link>
        </div>
      </nav>
    </header>
  );
}