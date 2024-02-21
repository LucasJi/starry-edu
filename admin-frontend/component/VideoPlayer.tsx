'use client';

import { FC, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';

const VideoPlayer: FC<{
  url: string;
  onEnded?: (onProgressProps: OnProgressProps) => void;
}> = ({ url, onEnded = () => {} }) => {
  const [hasWindow, setHasWindow] = useState(false);
  const progress = useRef<OnProgressProps>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });

  const handleEnd = () => {
    onEnded(progress.current);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
    }
  }, []);

  return (
    <div>
      {hasWindow && (
        <ReactPlayer
          controls
          url={url}
          width="800px"
          height="400px"
          style={{
            margin: 'auto',
          }}
          onEnded={handleEnd}
          onProgress={state => (progress.current = state)}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
