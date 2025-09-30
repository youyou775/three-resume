import { Experience } from '@/app/data/experienceData';
import { TechTags } from './TechTags';

interface ExperienceContentProps {
  experience: Experience;
  size?: 'small' | 'large';
}

export const ExperienceContent: React.FC<ExperienceContentProps> = ({ 
  experience, 
  size = 'large' 
}) => {
  const titleClass = size === 'small' ? 'text-3xl' : 'text-5xl';
  const subtitleClass = size === 'small' ? 'text-xs' : 'text-sm';
  const bulletClass = size === 'small' ? 'text-xs' : 'text-sm';
  const spacing = size === 'small' ? 'space-y-2' : 'space-y-3';

  return (
    <>
      <h1 className={`${titleClass} font-bold text-black mb-2`}>
        {experience.title}
      </h1>
      
      <p className={`${subtitleClass} text-gray-600 mb-4 font-medium`}>
        {experience.subtitle}
      </p>
      
      <div className={`${bulletClass} text-gray-600 leading-relaxed`}>
        <ul className={spacing}>
          {experience.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start">
              <span className="text-gray-400 mr-3 mt-1 text-xs">•</span>
              <span className="flex-1">{bullet}</span>
            </li>
          ))}
        </ul>

        <TechTags 
          technologies={experience.tech} 
          size={size === 'small' ? 'small' : 'medium'}
          className={size === 'small' ? 'mt-6' : 'mt-12'}
        />
      </div>
    </>
  );
};