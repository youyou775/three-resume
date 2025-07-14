

export default function IntroStage({
    onClick
}: {
    onClick: any
}) {
    return (
        <>
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    background: '#111',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.7s cubic-bezier(.77,0,.18,1)',
                }}
            >
                <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    border: '8px solid #444', borderTop: '8px solid #fff',
                    animation: 'spin 1.2s linear infinite', marginBottom: 32
                }} />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <h1>Welcome to the 3D Resume</h1>
                <button
                    style={{
                        marginTop: 32,
                        padding: '1rem 2rem',
                        fontSize: 20,
                        borderRadius: 8,
                        border: 'none',
                        background: '#fff',
                        color: '#111',
                        cursor: 'pointer'
                    }}
                    onClick={onClick}
                >
                    Click to Continue
                </button>
            </div>
        </>
    )
}