import { create } from 'zustand';

const useMediaStore = create((set) => ({
    mediaList: [
      {
        url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
        type: 'audio',
        title: 'Audio 1'
      },
      {
        url: 'https://videos.pexels.com/video-files/1893738/1893738-uhd_3840_2160_25fps.mp4',
        type: 'video',
        title: 'Video 1'
      },
      {
        url: 'https://videos.pexels.com/video-files/2157006/2157006-hd_1920_1080_25fps.mp4',
        type: 'video',
        title: 'Video 2'
      },
      {
        url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
        type: 'audio',
        title: 'Audio 2'
      },
      {
        url: 'http://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3',
        type: 'audio',
        title: 'Audio 3'
      },
      {
        url: 'https://videos.pexels.com/video-files/2177906/2177906-hd_1920_1080_30fps.mp4',
        type: 'video',
        title: 'Video 3'
      },
      {
        url: 'https://videos.pexels.com/video-files/5590457/5590457-uhd_3840_2160_30fps.mp4',
        type: 'video',
        title: 'Video 4'
      },
      // your media list here
    ],
    currentIndex: 0,
    setCurrentIndex: (index) => set({ currentIndex: index }),
    nextMedia: () => set((state) => ({
        currentIndex: (state.currentIndex + 1) % state.mediaList.length,
    })),
    prevMedia: () => set((state) => ({
        currentIndex: (state.currentIndex - 1 + state.mediaList.length) % state.mediaList.length,
    })),
}));

export default useMediaStore; // Ensure this line is present
