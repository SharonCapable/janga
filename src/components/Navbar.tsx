import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="glass-card" style={{
            margin: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 2rem',
            position: 'sticky',
            top: '1rem',
            zIndex: 1000,
            borderRadius: '24px'
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                <span className="text-gradient">JANGA</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link href="#features">Features</Link>
                <Link href="#models">Models</Link>
                <Link href="/login" className="btn-primary" style={{ padding: '8px 20px' }}>
                    Get Started
                </Link>
            </div>
        </nav>
    );
}
