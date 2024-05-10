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
