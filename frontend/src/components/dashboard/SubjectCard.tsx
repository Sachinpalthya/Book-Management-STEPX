import React from 'react';
import { Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubjectCardProps {
  id: string;
  name: string;
  colorClass: string;
  year: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ id, name, colorClass, year }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/subjects/${year}/${name}/${id}`);
  };

  return (
    <div 
      className={`${colorClass} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-white bg-opacity-50 rounded-full">
          <Book className="h-10 w-10 text-gray-700" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
          <p className="text-sm text-gray-600 mt-1">Click to manage chapters</p>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;