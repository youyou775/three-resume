interface TechTagsProps {
  technologies: string[];
  size?: 'small' | 'medium';
  className?: string;
}

export const TechTags: React.FC<TechTagsProps> = ({
  technologies,
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = size === 'small'
    ? 'px-1.5 py-0.25 text-xs'
    : 'px-2 py-0.5 text-sm';

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {technologies.map((tech, index) => (
        <div key={index} className={`bg-gray-400 rounded-xl ${sizeClasses}`}>
          <p className="italic text-gray-900">{tech}</p>
        </div>
      ))}
    </div>
  );
};