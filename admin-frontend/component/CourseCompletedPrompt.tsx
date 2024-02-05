import Image from 'next/image';
import MedalIcon from 'public/icon-medal.png';
import { FC } from 'react';

const CourseCompletedPrompt: FC = () => {
  return (
    <div className="flex items-center">
      <Image src={MedalIcon} alt="medal-icon" width={24} height={24} />
      <span
        style={{
          color: 'red',
          marginLeft: '1rem',
        }}
      >
        恭喜你学完此课程!
      </span>
    </div>
  );
};

export default CourseCompletedPrompt;
