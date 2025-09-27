export default function AboutStage({
}: {
    }) {
    return (
        <>
            <div
                style={{
                    // position: 'absolute',
                    // left: 0,
                    // top: 0,
                    marginTop: '100vh',
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // background: '#fafafa',
                    color: '#222',
                    // zIndex: 3,
                    // opacity: 1,
                    pointerEvents: 'auto',
                    transition: 'opacity 0.7s cubic-bezier(.77,0,.18,1)',
                }}
            >
                <div>

                    <h2 style={{ fontSize: 12, marginLeft: '5px' }}>About</h2>
                    <p style={{ maxWidth: 500, textAlign: 'center', margin: '1rem 0', fontSize: 52 }}>
                        I create Architecture design & Software
                    </p>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: 32,
                    left: 0,
                    width: '100%',
                    textAlign: 'center',
                    color: '#888',
                    fontSize: 14
                }}>
                    <span>Scroll down to continue</span>
                </div>
            </div >

        </>
    )
}