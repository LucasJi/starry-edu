'use client';

import { FC, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer: FC<{ url: string; onEnded?: () => void }> = ({
  url,
  onEnded = () => {},
}) => {
  const [hasWindow, setHasWindow] = useState(false);
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
          onEnded={onEnded}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
