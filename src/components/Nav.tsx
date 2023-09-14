import { useState } from 'react';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu */}
      {menuOpen && (
        <aside className="sm:hidden grid grid-cols-1 justify-items-center gap-8 px-10 py-6 fixed h-screen w-screen bg-background text-primary text-4xl ">
          <div className="grid grid-cols-3 gap-8 justify-between items-center mb-20 w-full">
            <div>
              <button className="z-50 p-4 text-foreground rounded-xl hover:bg-primary" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <a href="/" className="hover:text-foreground/80 text-center" onClick={() => setMenuOpen(false)}>
              <h2 className="text-2xl">DJ</h2>
            </a>
          </div>

          <a href="/#intro" className="hover:text-foreground/80" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="/#projects" className="hover:text-foreground/80" onClick={() => setMenuOpen(false)}>
            Projects
          </a>
          <a href="/thoughts" className="hover:text-foreground/80" onClick={() => setMenuOpen(false)}>
            Thoughts
          </a>
        </aside>
      )}

      <div className="grid grid-cols-3 gap-8 px-10 py-8 bg-primary text-white w-full justify-between items-center">
        <div className="hidden sm:flex items-center w-full gap-10 font-bold text-2xl">
          <a href="/" className="mr-20">
            <h2>DJ</h2>
          </a>
          <a href="/#intro">About</a>
          <a href="/#projects">Projects</a>
          <a href="/thoughts">Thoughts</a>
        </div>

        <div>
          <button
            className="block sm:hidden z-50 p-4 text-foreground rounded-xl hover:bg-primary"
            aria-label="Open menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <h2 className="block sm:hidden text-center">Dominik Jessen</h2>
      </div>
    </>
  );
}
