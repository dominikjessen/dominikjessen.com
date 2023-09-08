export default function Card({ title, textColor }: { title: string; textColor?: string }) {
  return (
    <div className="w-52 h-80 p-12 bg-fuchsia-300 rounded">
      <h2 className={`font-bold ${textColor}`}>{title}</h2>
    </div>
  );
}
