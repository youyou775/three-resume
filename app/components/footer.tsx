


export default function Footer({
    headerFooterTransparent,
    getAlignStyle
}: {
    headerFooterTransparent: boolean;
    getAlignStyle: () => React.CSSProperties;
    }) {

    return (
        <>
      <footer
        style={{
          width: '100vw',
          height: 32,
          position: 'fixed',
          left: 0,
          bottom: 0,
          zIndex: 10,
          background: headerFooterTransparent ? 'transparent' : 'rgba(255,255,255,1)',
          borderTop: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          ...getAlignStyle(),
          transition: 'background 0.3s',
        }}
      >
        <span>Footer</span>
      </footer>
        </>
    )
}