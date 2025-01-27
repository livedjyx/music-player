'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  FaPlay, FaPause, FaStepForward, FaStepBackward, 
  FaVolumeUp, FaRandom, FaRedoAlt, FaList, FaMusic,
  FaTimes
} from 'react-icons/fa';
import { Song, PlayerState, PlayMode, ParsedLyric } from './types';
import DancingStickman from '../DancingStickman/DancingStickman';

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
  },
  {
    id: '4',
    title: 'Lofi Study',
    artist: 'FASSounds',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_1808fb3f7f.mp3',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200',
    lyrics: `[00:00.00]Lofi Study
[00:03.00]By FASSounds
[00:06.00]纯音乐，请欣赏...`
  },
  {
    id: '5',
    title: 'Ambient Piano',
    artist: 'SergeQuadrado',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_1c2c59d04a.mp3',
    cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200',
    lyrics: `[00:00.00]Ambient Piano
[00:03.00]By SergeQuadrado
[00:06.00]纯音乐，请欣赏...`
  },
  {
    id: '6',
    title: 'Chill Lofi',
    artist: 'Coma-Media',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_2dde668d05.mp3',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200',
    lyrics: `[00:00.00]Chill Lofi
[00:03.00]By Coma-Media
[00:06.00]纯音乐，请欣赏...`
  },
  {
    id: '7',
    title: 'Inspiring Cinematic',
    artist: 'Music_Unlimited',
    url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc7c1d47.mp3',
    cover: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=200',
    lyrics: `[00:00.00]Inspiring Cinematic
[00:03.00]By Music_Unlimited
[00:06.00]纯音乐，请欣赏...`
  },
  {
    id: '8',
    title: 'Beautiful Dream',
    artist: 'Lesfm',
    url: 'https://cdn.pixabay.com/download/audio/2023/06/13/audio_7cab75799f.mp3',
    cover: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200',
    lyrics: `[00:00.00]Beautiful Dream
[00:03.00]By Lesfm
[00:06.00]纯音乐，请欣赏...`
  },
  {
    id: '9',
    title: 'Relaxing Jazz',
    artist: 'Ashot-Danielyan',
    url: 'https://cdn.pixabay.com/download/audio/2023/06/13/audio_d2fde21ea6.mp3',
    cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=200',
    lyrics: `[00:00.00]Relaxing Jazz
[00:03.00]By Ashot-Danielyan
[00:06.00]纯音乐，请欣赏...`
  },
  {
    id: '10',
    title: 'Meditation',
    artist: 'SergePavkinMusic',
    url: 'https://cdn.pixabay.com/download/audio/2023/03/28/audio_6aa2c4ef4d.mp3',
    cover: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=200',
    lyrics: `[00:00.00]Meditation
[00:03.00]By SergePavkinMusic
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

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: defaultSongs[0],
    isPlaying: false,
    progress: 0,
    duration: 0,
    volume: 1,
    playMode: PlayMode.ORDER,
    showPlaylist: false,
    showLyrics: false
  });
  const [parsedLyrics, setParsedLyrics] = useState<ParsedLyric[]>([]);
  const [currentLyric, setCurrentLyric] = useState<string>('');

  // 尝试播放音频
  const tryPlayAudio = async (audio: HTMLAudioElement) => {
    try {
      // 等待音频完全加载
      await new Promise((resolve, reject) => {
        if (audio.readyState >= 3) { // HAVE_FUTURE_DATA
          resolve(true);
          return;
        }

        const loadHandler = () => {
          if (audio.readyState >= 3) {
            cleanup();
            resolve(true);
          }
        };

        const errorHandler = (e: Event) => {
          cleanup();
          reject(new Error('音频加载失败'));
        };

        const cleanup = () => {
          audio.removeEventListener('canplay', loadHandler);
          audio.removeEventListener('loadeddata', loadHandler);
          audio.removeEventListener('error', errorHandler);
        };

        audio.addEventListener('canplay', loadHandler);
        audio.addEventListener('loadeddata', loadHandler);
        audio.addEventListener('error', errorHandler);
      });

      // 确保没有其他播放操作正在进行
      if (audio.paused) {
        await audio.play();
      }
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // 忽略中断错误，这通常是由用户操作导致的
        return false;
      }
      console.error('播放失败:', error);
      return false;
    }
  };

  // 切换歌曲
  const changeSong = async (song: Song, shouldPlay: boolean = false) => {
    if (!audioRef.current) return false;

    try {
      // 先暂停当前播放
      audioRef.current.pause();
      
      // 更新音频源
      audioRef.current.src = song.url;
      audioRef.current.load();

      // 更新状态
      setPlayerState(prev => ({
        ...prev,
        currentSong: song,
        progress: 0,
        isPlaying: false // 先设置为暂停状态
      }));

      // 如果需要播放，等待加载完成后再播放
      if (shouldPlay) {
        const playSuccess = await tryPlayAudio(audioRef.current);
        if (playSuccess) {
          setPlayerState(prev => ({ ...prev, isPlaying: true }));
          return true;
        } else {
          alert(`无法播放歌曲: ${song.title}`);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('切换歌曲失败:', error);
      alert(`切换歌曲失败: ${song.title}`);
      return false;
    }
  };

  // 切换到下一首
  const handleNext = async () => {
    if (!playerState.currentSong) return;
    
    const currentIndex = defaultSongs.findIndex(
      song => song.id === playerState.currentSong?.id
    );
    
    let nextIndex;
    if (playerState.playMode === PlayMode.SHUFFLE) {
      do {
        nextIndex = Math.floor(Math.random() * defaultSongs.length);
      } while (nextIndex === currentIndex && defaultSongs.length > 1);
    } else {
      nextIndex = (currentIndex + 1) % defaultSongs.length;
    }

    const wasPlaying = playerState.isPlaying;
    await changeSong(defaultSongs[nextIndex], wasPlaying);
  };

  // 切换到上一首
  const handlePrev = async () => {
    if (!playerState.currentSong) return;
    
    const currentIndex = defaultSongs.findIndex(
      song => song.id === playerState.currentSong?.id
    );
    
    let prevIndex;
    if (playerState.playMode === PlayMode.SHUFFLE) {
      do {
        prevIndex = Math.floor(Math.random() * defaultSongs.length);
      } while (prevIndex === currentIndex && defaultSongs.length > 1);
    } else {
      prevIndex = (currentIndex - 1 + defaultSongs.length) % defaultSongs.length;
    }

    const wasPlaying = playerState.isPlaying;
    await changeSong(defaultSongs[prevIndex], wasPlaying);
  };

  // 播放控制
  const togglePlay = async () => {
    if (!audioRef.current || !playerState.currentSong) return;

    try {
      if (playerState.isPlaying) {
        audioRef.current.pause();
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
      } else {
        const playSuccess = await tryPlayAudio(audioRef.current);
        if (playSuccess) {
          setPlayerState(prev => ({ ...prev, isPlaying: true }));
        }
      }
    } catch (error) {
      console.error('播放控制失败:', error);
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  // 监听播放进度
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setPlayerState(prev => ({
        ...prev,
        progress: audio.currentTime,
        duration: audio.duration || 0
      }));
    };

    const handleEnded = () => {
      if (playerState.playMode === PlayMode.REPEAT) {
        audio.currentTime = 0;
        tryPlayAudio(audio).catch(console.error);
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('durationchange', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('durationchange', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playerState.playMode]);

  // 监听当前歌曲变化
  useEffect(() => {
    if (!playerState.currentSong) return;
    setParsedLyrics(parseLyrics(playerState.currentSong.lyrics));
  }, [playerState.currentSong]);

  // 监听歌词变化
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateLyric = () => {
      const currentLyric = parsedLyrics.reduce((acc, lyric) => {
        if (lyric.time <= audio.currentTime) return lyric.text;
        return acc;
      }, '');
      setCurrentLyric(currentLyric);
    };

    audio.addEventListener('timeupdate', updateLyric);

    return () => {
      audio.removeEventListener('timeupdate', updateLyric);
    };
  }, [parsedLyrics]);

  // 处理播放模式
  const handlePlayModeChange = () => {
    const modes: PlayMode[] = [PlayMode.ORDER, PlayMode.REPEAT, PlayMode.REPEAT_ONE, PlayMode.SHUFFLE];
    const currentIndex = modes.indexOf(playerState.playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setPlayerState(prev => ({ ...prev, playMode: nextMode }));
  };

  // 获取下一首歌
  const getNextSong = useCallback(() => {
    if (!playerState.currentSong) return null;
    
    const currentIndex = defaultSongs.findIndex(song => song.id === playerState.currentSong?.id);
    
    switch (playerState.playMode) {
      case PlayMode.REPEAT_ONE:
        return playerState.currentSong;
      case PlayMode.SHUFFLE:
        const randomIndex = Math.floor(Math.random() * defaultSongs.length);
        return defaultSongs[randomIndex];
      case PlayMode.REPEAT:
      case PlayMode.ORDER:
      default:
        return defaultSongs[(currentIndex + 1) % defaultSongs.length];
    }
  }, [playerState.currentSong, playerState.playMode]);

  // 获取上一首歌
  const getPrevSong = useCallback(() => {
    if (!playerState.currentSong) return null;
    
    const currentIndex = defaultSongs.findIndex(song => song.id === playerState.currentSong?.id);
    
    switch (playerState.playMode) {
      case PlayMode.REPEAT_ONE:
        return playerState.currentSong;
      case PlayMode.SHUFFLE:
        const randomIndex = Math.floor(Math.random() * defaultSongs.length);
        return defaultSongs[randomIndex];
      case PlayMode.REPEAT:
      case PlayMode.ORDER:
      default:
        return defaultSongs[(currentIndex - 1 + defaultSongs.length) % defaultSongs.length];
    }
  }, [playerState.currentSong, playerState.playMode]);

  const getPlayModeIcon = () => {
    switch (playerState.playMode) {
      case PlayMode.SHUFFLE:
        return <FaRandom />;
      case PlayMode.REPEAT_ONE:
        return <FaRedoAlt className="relative"><span className="absolute text-xs">1</span></FaRedoAlt>;
      case PlayMode.REPEAT:
        return <FaRedoAlt />;
      default:
        return <FaRedoAlt className="opacity-50" />;
    }
  };

  // 音频错误处理
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = (e: Event) => {
      const error = audio.error;
      console.error('音频错误:', error);
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
      
      let errorMessage = '播放出错';
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = '播放被中断';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = '网络错误';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = '音频解码错误';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = '不支持的音频格式';
            break;
        }
      }
      alert(`${errorMessage}: ${playerState.currentSong?.title}`);
    };

    audio.addEventListener('error', handleError);
    return () => audio.removeEventListener('error', handleError);
  }, [playerState.currentSong]);

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <DancingStickman isPlaying={playerState.isPlaying} />
      
      {/* 播放列表 */}
      {playerState.showPlaylist && (
        <div className="absolute bottom-full w-full">
          <div className="max-w-4xl mx-auto cyber-box rounded-t-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold neon-text">播放列表</h3>
              <button
                onClick={() => setPlayerState(prev => ({ ...prev, showPlaylist: false }))}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <FaTimes className="text-cyan-400" />
              </button>
            </div>
            <div className="space-y-2">
              {defaultSongs.map(song => (
                <div
                  key={song.id}
                  className={`flex items-center p-2 hover:bg-white/10 cursor-pointer rounded-lg transition-all hover:scale-105 ${
                    song.id === playerState.currentSong?.id ? 'cyber-box bg-opacity-50' : ''
                  }`}
                  onClick={() => {
                    setPlayerState(prev => ({ 
                      ...prev, 
                      currentSong: song,
                      isPlaying: true
                    }));
                  }}
                >
                  <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg mr-3 object-cover" />
                  <div>
                    <div className="font-medium cyber-gradient">{song.title}</div>
                    <div className="text-sm text-cyan-400">{song.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 歌词显示 */}
      {playerState.showLyrics && (
        <div className="absolute bottom-full w-full">
          <div className="max-w-4xl mx-auto cyber-box rounded-t-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold neon-text">歌词</h3>
              <button
                onClick={() => setPlayerState(prev => ({ ...prev, showLyrics: false }))}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <FaTimes className="text-cyan-400" />
              </button>
            </div>
            <div className="text-center space-y-2 max-h-64 overflow-y-auto">
              {parsedLyrics.map((lyric, index) => (
                <div
                  key={index}
                  className={`py-1 transition-all ${
                    lyric.text === currentLyric 
                      ? 'neon-text scale-110' 
                      : 'text-cyan-400'
                  }`}
                >
                  {lyric.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="cyber-box backdrop-blur-md">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            {/* Song Info */}
            <div className="flex items-center space-x-4">
              {playerState.currentSong?.cover && (
                <img
                  src={playerState.currentSong.cover}
                  alt={playerState.currentSong.title}
                  className="w-16 h-16 rounded-lg shadow-lg hover:scale-105 transition-transform cyber-box p-1"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg neon-text">
                  {playerState.currentSong?.title || 'No song selected'}
                </h3>
                <p className="text-cyan-400">{playerState.currentSong?.artist}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-6">
              <button
                onClick={handlePlayModeChange}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400"
                title={`当前模式: ${playerState.playMode}`}
              >
                {getPlayModeIcon()}
              </button>
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400"
              >
                <FaStepBackward />
              </button>
              <button
                onClick={togglePlay}
                className="p-4 cyber-box rounded-full hover:scale-110 transition-all"
              >
                {playerState.isPlaying ? 
                  <FaPause className="text-xl text-cyan-400" /> : 
                  <FaPlay className="text-xl text-cyan-400" />
                }
              </button>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400"
              >
                <FaStepForward />
              </button>
              <button
                onClick={() => setPlayerState(prev => ({ ...prev, showPlaylist: !prev.showPlaylist }))}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400"
                title="播放列表"
              >
                <FaList />
              </button>
              <button
                onClick={() => setPlayerState(prev => ({ ...prev, showLyrics: !prev.showLyrics }))}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400"
                title="歌词"
              >
                <FaMusic />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <FaVolumeUp className="text-cyan-400" />
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
                className="w-24 accent-cyan-400"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-700 h-1 rounded-full overflow-hidden cyber-box">
              <div
                className="h-1 rounded-full transition-all cyber-gradient"
                style={{
                  width: `${(playerState.progress / playerState.duration) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between text-sm mt-1 text-cyan-400">
              <span>{Math.floor(playerState.progress)}s</span>
              <span>{Math.floor(playerState.duration)}s</span>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={playerState.currentSong?.url}
        preload="metadata"
        volume={playerState.volume}
      />
    </div>
  );
};

export default MusicPlayer;
