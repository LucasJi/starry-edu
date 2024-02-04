'use client';

import { FC } from 'react';

const Course: FC<{ params: { id: number } }> = ({ params: { id } }) => {
  return <div className="w-3/5 mx-auto h-full">course with id: {id}</div>;
};

export default Course;
