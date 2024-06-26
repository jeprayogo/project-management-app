import { Head, Link } from "@inertiajs/react";

export default function PageNotFound() {
    return (
        <>
            <Head title="Page Not Found" />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', color: '#636b6f', fontFamily: 'Nunito, sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '72px', marginBottom: '40px' }}>404</h1>
                    <p>Page Not Found</p>
                    <Link href="/" style={{ color: '#636b6f', textDecoration: 'none', fontSize: '24px' }}>Go to Homepage</Link>
                </div>
            </div>
        </>
    )
};
