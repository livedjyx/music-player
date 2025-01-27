'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  FaPlay, FaPause, FaStepForward, FaStepBackward, 
  FaVolumeUp, FaRandom, FaRedoAlt, FaList, FaMusic,
  FaTimes
} from 'react-icons/fa';
import { Song, PlayerState, PlayMode, ParsedLyric } from './types';

const defaultSongs: Song[] = [
  {
    id: '1',
    title: 'Forest Lullaby',
    artist: 'Lesfm',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
    lyrics: `[00:00.00]Forest Lullaby
[00:03.00]By Lesfm
[00:06.00]纯音乐，请欣赏...`
  },
  {
    id: '2',
    title: 'Summer Walk',
    artist: 'Olexy',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
    lyrics: `[00:00.00]Summer Walk
[00:03.00]By Olexy
[00:06.00]纯音乐，请欣赏...`
  },
  {
    id: '3',
    title: 'Good Night',
    artist: 'FASSounds',
    url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_2449b4c52d.mp3',
    cover: 'https://images.unsplash.com/photo-1517230878791-4d28214057c2?w=200',
    lyrics: `[00:00.00]Good Night
[00:03.00]By FASSounds
[00:06.00]纯音乐，请欣赏...`
  }
];

// 解析歌词时间戳
const parseLyricTime = (timeStr: string): number => {
  const [min, sec] = timeStr.slice(1, -1).split(':').map(Number);
  return min * 60 + sec;
};

// 解析歌词
const parseLyrics = (lyricsStr?: string): ParsedLyric[] => {
  if (!lyricsStr) return [];
  return lyricsStr
    .split('\n')
    .map(line => {
      const timeRegex = /\[(\d{2}:\d{2}\.\d{2})\]/;
      const match = line.match(timeRegex);
      if (!match) return null;
      const time = parseLyricTime(match[0]);
      const text = line.replace(timeRegex, '').trim();
      return { time, text };
    })
    .filter((lyric): lyric is ParsedLyric => lyric !== null);
};

export default function MusicPlayer() {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: defaultSongs[0],
    isPlaying: false,
    volume: 1,
    progress: 0,
    duration: 0,
    playMode: 'normal',
    showPlaylist: false,
    showLyrics: false
  });

  const [currentLyric, setCurrentLyric] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [parsedLyrics, setParsedLyrics] = useState<ParsedLyric[]>([]);

  // 更新歌词
  useEffect(() => {
    if (playerState.currentSong?.lyrics) {
      setParsedLyrics(parseLyrics(playerState.currentSong.lyrics));
    } else {
      setParsedLyrics([]);
    }
  }, [playerState.currentSong]);

  // 处理播放模式
  const handlePlayModeChange = () => {
    const modes: PlayMode[] = ['normal', 'repeat', 'repeat-one', 'shuffle'];
    const currentIndex = modes.indexOf(playerState.playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setPlayerState(prev => ({ ...prev, playMode: nextMode }));
  };

  // 获取下一首歌
  const getNextSong = useCallback(() => {
    const currentIndex = defaultSongs.findIndex(song => song.id === playerState.currentSong?.id);
    
    switch (playerState.playMode) {
      case 'repeat-one':
        return playerState.currentSong;
      case 'shuffle':
        const randomIndex = Math.floor(Math.random() * defaultSongs.length);
        return defaultSongs[randomIndex];
      case 'repeat':
      case 'normal':
      default:
        return defaultSongs[(currentIndex + 1) % defaultSongs.length];
    }
  }, [playerState.currentSong?.id, playerState.playMode]);

  // 获取上一首歌
  const getPrevSong = useCallback(() => {
    const currentIndex = defaultSongs.findIndex(song => song.id === playerState.currentSong?.id);
    
    switch (playerState.playMode) {
      case 'repeat-one':
        return playerState.currentSong;
      case 'shuffle':
        const randomIndex = Math.floor(Math.random() * defaultSongs.length);
        return defaultSongs[randomIndex];
      case 'repeat':
      case 'normal':
      default:
        return defaultSongs[(currentIndex - 1 + defaultSongs.length) % defaultSongs.length];
    }
  }, [playerState.currentSong?.id, playerState.playMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const currentTime = audio.currentTime;
      setPlayerState(prev => ({
        ...prev,
        progress: currentTime,
        duration: audio.duration
      }));

      // 更新当前歌词
      const currentLyric = parsedLyrics.reduce((acc, lyric) => {
        if (lyric.time <= currentTime) return lyric.text;
        return acc;
      }, '');
      setCurrentLyric(currentLyric);
    };

    const handleError = (e: Event) => {
      const error = (e.target as HTMLAudioElement).error;
      console.error('Audio error:', error?.code, error?.message);
      alert(`播放出错: ${error?.message || '未知错误'}`);
    };

    const handlePlay = () => {
      console.log('Audio play event');
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      console.log('Audio pause event');
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleEnded = () => {
      console.log('Audio ended event');
      if (playerState.playMode === 'repeat-one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        const nextSong = getNextSong();
        if (nextSong) {
          setPlayerState(prev => ({ 
            ...prev, 
            currentSong: nextSong,
            isPlaying: true
          }));
        }
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playerState.playMode, getNextSong, parsedLyrics]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        console.log('Playing audio...');
        await audio.play();
      } else {
        console.log('Pausing audio...');
        audio.pause();
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
      alert('播放出错，请稍后再试');
    }
  };

  const handleNext = () => {
    const nextSong = getNextSong();
    if (nextSong) {
      setPlayerState(prev => ({ 
        ...prev, 
        currentSong: nextSong,
        isPlaying: true
      }));
    }
  };

  const handlePrev = () => {
    const prevSong = getPrevSong();
    if (prevSong) {
      setPlayerState(prev => ({ 
        ...prev, 
        currentSong: prevSong,
        isPlaying: true
      }));
    }
  };

  const getPlayModeIcon = () => {
    switch (playerState.playMode) {
      case 'shuffle':
        return <FaRandom />;
      case 'repeat-one':
        return <FaRedoAlt className="relative"><span className="absolute text-xs">1</span></FaRedoAlt>;
      case 'repeat':
        return <FaRedoAlt />;
      default:
        return <FaRedoAlt className="opacity-50" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white">
      {/* 播放列表 */}
      {playerState.showPlaylist && (
        <div className="absolute bottom-full w-full bg-gray-800 p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">播放列表</h3>
            <button
              onClick={() => setPlayerState(prev => ({ ...prev, showPlaylist: false }))}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              <FaTimes />
            </button>
          </div>
          <div className="space-y-2">
            {defaultSongs.map(song => (
              <div
                key={song.id}
                className={`flex items-center p-2 hover:bg-gray-700 cursor-pointer rounded ${
                  song.id === playerState.currentSong?.id ? 'bg-gray-700' : ''
                }`}
                onClick={() => {
                  setPlayerState(prev => ({ 
                    ...prev, 
                    currentSong: song,
                    isPlaying: true
                  }));
                }}
              >
                <img src={song.cover} alt={song.title} className="w-10 h-10 rounded mr-3" />
                <div>
                  <div className="font-medium">{song.title}</div>
                  <div className="text-sm text-gray-400">{song.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 歌词显示 */}
      {playerState.showLyrics && (
        <div className="absolute bottom-full w-full bg-gray-800 bg-opacity-90 p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">歌词</h3>
            <button
              onClick={() => setPlayerState(prev => ({ ...prev, showLyrics: false }))}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              <FaTimes />
            </button>
          </div>
          <div className="text-center space-y-2">
            {parsedLyrics.map((lyric, index) => (
              <div
                key={index}
                className={`py-1 ${
                  lyric.text === currentLyric ? 'text-blue-400 font-bold' : 'text-gray-400'
                }`}
              >
                {lyric.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4">
            {playerState.currentSong?.cover && (
              <img
                src={playerState.currentSong.cover}
                alt={playerState.currentSong.title}
                className="w-16 h-16 rounded-lg"
              />
            )}
            <div>
              <h3 className="font-semibold">{playerState.currentSong?.title || 'No song selected'}</h3>
              <p className="text-gray-400">{playerState.currentSong?.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-6">
            <button
              onClick={handlePlayModeChange}
              className="p-2 hover:bg-gray-800 rounded-full"
              title={`当前模式: ${playerState.playMode}`}
            >
              {getPlayModeIcon()}
            </button>
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <FaStepBackward />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 hover:bg-gray-800 rounded-full"
            >
              {playerState.isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <FaStepForward />
            </button>
            <button
              onClick={() => setPlayerState(prev => ({ ...prev, showPlaylist: !prev.showPlaylist }))}
              className="p-2 hover:bg-gray-800 rounded-full"
              title="播放列表"
            >
              <FaList />
            </button>
            <button
              onClick={() => setPlayerState(prev => ({ ...prev, showLyrics: !prev.showLyrics }))}
              className="p-2 hover:bg-gray-800 rounded-full"
              title="歌词"
            >
              <FaMusic />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-2">
            <FaVolumeUp />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={playerState.volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setPlayerState(prev => ({ ...prev, volume: newVolume }));
                if (audioRef.current) {
                  audioRef.current.volume = newVolume;
                }
              }}
              className="w-24"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-gray-700 h-1 rounded-full">
            <div
              className="bg-blue-500 h-1 rounded-full"
              style={{
                width: `${(playerState.progress / playerState.duration) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>{Math.floor(playerState.progress)}s</span>
            <span>{Math.floor(playerState.duration)}s</span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={playerState.currentSong?.url}
        preload="metadata"
      />
    </div>
  );
}
