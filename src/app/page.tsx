'use client';

import ClientPage from '@/components/ClientPage'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 mb-24 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          音乐播放器
        </h1>
        <p className="text-gray-300 mb-8">
          享受优质音乐，感受美好生活
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="glass p-4 rounded-xl hover-scale">
            <h2 className="text-xl font-semibold mb-2 gradient-text">简洁界面</h2>
            <p className="text-gray-400">现代化的UI设计，简洁而不简单</p>
          </div>
          <div className="glass p-4 rounded-xl hover-scale">
            <h2 className="text-xl font-semibold mb-2 gradient-text">播放控制</h2>
            <p className="text-gray-400">支持多种播放模式，随心切换</p>
          </div>
          <div className="glass p-4 rounded-xl hover-scale">
            <h2 className="text-xl font-semibold mb-2 gradient-text">歌词显示</h2>
            <p className="text-gray-400">同步显示歌词，跟着音乐一起唱</p>
          </div>
        </div>
      </div>
      <ClientPage />
    </main>
  )
}