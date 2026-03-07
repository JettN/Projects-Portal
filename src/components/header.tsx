import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ padding: '1rem', background: '#333', color: '#fff' }}>
      <nav>
        <Link href="/" style={{ color: '#fff', marginRight: '15px' }}>Home</Link>
        <Link href="/projects" style={{ color: '#fff', marginRight: '15px' }}>All Projects</Link>
        <Link href="/admin" style={{ color: '#fff' }}>Admin Panel</Link>
      </nav>
    </header>
  );
}