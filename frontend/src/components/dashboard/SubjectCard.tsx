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
      className={`${colorClass} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center justify-center text-center`}
      onClick={handleClick}
    >
      <Book className="h-12 w-12 mb-4 text-gray-700" />
      <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
    </div>
  );
};

export default SubjectCard;