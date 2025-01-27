export enum PlayMode {
  ORDER = 'order',
  REPEAT = 'repeat',
  REPEAT_ONE = 'repeat-one',
  SHUFFLE = 'shuffle'
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
  lyrics?: string; // 歌词文本，格式为 "[00:00.00]歌词"
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playMode: PlayMode;
  showPlaylist: boolean;
  showLyrics: boolean;
}

export interface ParsedLyric {
  time: number; // 时间（秒）
  text: string; // 歌词文本
}
