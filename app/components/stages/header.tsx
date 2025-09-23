

import {HeaderFooterAlign} from '../Scene';

export default function Header({
    headerFooterTransparent,
    setHeaderFooterTransparent,
    setHeaderFooterAlign,
    getAlignStyle
}: {
    headerFooterTransparent: boolean;
    setHeaderFooterTransparent: React.Dispatch<React.SetStateAction<boolean>>;
    headerFooterAlign: HeaderFooterAlign;
    setHeaderFooterAlign: React.Dispatch<React.SetStateAction<HeaderFooterAlign>>;
    getAlignStyle: () => React.CSSProperties;
    }) {

    return (
        <>
            <header
                style={{
                    width: '100vw',
                    height: 32,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    background: headerFooterTransparent ? 'transparent' : 'rgba(255,255,255,1)',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    ...getAlignStyle(),
                    transition: 'background 0.3s',
                }}
            >
                <span style={{ fontWeight: 700 }}>Header</span>
                <div style={{ marginLeft: 16, display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => setHeaderFooterTransparent((v) => !v)}
                        style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: 4,
                            border: 'none',
                            background: '#333',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: 12,
                        }}
                    >
                        Toggle Transparency
                    </button>
                    <button
                        onClick={() => setHeaderFooterAlign('left')}
                        style={{ fontSize: 12, borderRadius: 4, border: 'none', padding: '0.25rem 0.75rem', background: '#eee', cursor: 'pointer' }}
                    >Left</button>
                    <button
                        onClick={() => setHeaderFooterAlign('center')}
                        style={{ fontSize: 12, borderRadius: 4, border: 'none', padding: '0.25rem 0.75rem', background: '#eee', cursor: 'pointer' }}
                    >Center</button>
                    <button
                        onClick={() => setHeaderFooterAlign('right')}
                        style={{ fontSize: 12, borderRadius: 4, border: 'none', padding: '0.25rem 0.75rem', background: '#eee', cursor: 'pointer' }}
                    >Right</button>
                </div>
            </header>
        </>
    )
}