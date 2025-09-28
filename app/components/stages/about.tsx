export default function About() {
  return (
    <div className="fixed top-[-50%] h-screen flex flex-col items-center justify-center">
      <div className="mt-[100vh] w-screen h-screen flex flex-col items-center justify-center text-gray-800 pointer-events-auto transition-opacity duration-700 ease-[cubic-bezier(.77,0,.18,1)]">
        <div>
          <h2 className="text-xs ml-1">About</h2>
          <p className="max-w-[500px] text-center mx-0 my-4 text-[52px] leading-tight">
            I create Architecture design & Software
          </p>
        </div>
        
        <div className="absolute bottom-8 left-0 w-full text-center text-gray-500 text-sm">
          <span>Scroll down to continue</span>
        </div>
      </div>
    </div>
  );
}