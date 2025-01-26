'use client';

import dynamic from 'next/dynamic';

const MusicPlayer = dynamic(() => import('@/components/MusicPlayer/MusicPlayer'), {
  ssr: false
});

export default function ClientPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Music Player</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 歌曲列表将在这里添加 */}
        </div>
      </div>
      <MusicPlayer />
    </main>
  );
}
