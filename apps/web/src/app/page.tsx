export default async function Home() {
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  let message = 'Carregando...';

  try {
    // O Next.js faz fetch no servidor (Server Component), então não sofre CORS aqui!
    const res = await fetch(`${API_URL}/`, { cache: 'no-store' });
    message = await res.text();
  } catch (error) {
    message = 'Erro ao conectar com a API (Verifique se a URL está certa)';
    console.error(error);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">SmartCondo 🏢</h1>
      <div className="p-6 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700">
        <h2 className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Status do Backend:</h2>
        <p className="text-green-400 font-mono text-xl">
          {message}
        </p>
      </div>
    </div>
  );
}