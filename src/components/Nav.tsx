export default function Nav() {
  return (
    <div className="flex gap-8 p-6 border-b-2 border-b-blue-400">
      <a href="/">
        <h2>DJ</h2>
      </a>
      <a href="/#intro">About</a>
      <a>Projects</a>
      <a href="/thoughts">Thoughts</a>
    </div>
  );
}
