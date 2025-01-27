'use client';

import ClientPage from '@/components/ClientPage'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="cyber-box rounded-2xl p-8 mb-24 max-w-2xl w-full text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 cyber-glitch neon-text" data-text="音乐播放器">
            音乐播放器
          </h1>
          <p className="text-cyan-400 mb-8 cyber-gradient">
            未来科技，现在聆听
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="cyber-box p-4 rounded-xl transform hover:scale-105 transition-all">
              <h2 className="text-xl font-semibold mb-2 neon-text">全息音效</h2>
              <p className="text-cyan-400">沉浸式音频体验，感受未来</p>
            </div>
            <div className="cyber-box p-4 rounded-xl transform hover:scale-105 transition-all">
              <h2 className="text-xl font-semibold mb-2 neon-text">神经连接</h2>
              <p className="text-cyan-400">智能推荐，心灵共鸣</p>
            </div>
            <div className="cyber-box p-4 rounded-xl transform hover:scale-105 transition-all">
              <h2 className="text-xl font-semibold mb-2 neon-text">量子同步</h2>
              <p className="text-cyan-400">实时歌词，跨次元演唱</p>
            </div>
          </div>
        </div>
      </div>
      <ClientPage />
    </main>
  )
}