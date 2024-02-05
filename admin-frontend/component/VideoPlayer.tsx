'use client';

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url }: { url: string }) => {
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
          onEnded={() => console.log('video ends')}
          onProgress={props => {
            console.log('on progress', props);
          }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
