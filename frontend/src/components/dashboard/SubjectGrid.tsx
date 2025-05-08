import React from 'react';
import SubjectCard from './SubjectCard';
import { SUBJECT_LIST, SUBJECT_COLORS, YearType } from '../../types/subject';

interface SubjectGridProps {
  year: YearType;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ year }) => {
  // In a real app, you would fetch subjects from the API
  // For demonstration, we'll use the predefined list
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {year === 'Masters' ? 'Masters' : `${year} Year`} Subjects
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {SUBJECT_LIST.map((subject, index) => (
          <SubjectCard
            key={index}
            id={`subject-${index}`}
            name={subject}
            colorClass={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
            year={year}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectGrid;