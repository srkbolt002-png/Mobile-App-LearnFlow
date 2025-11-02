import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Users as UsersIcon } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { getAvatarColor } from '@/lib/avatarColors';
import { triggerHaptic } from '@/lib/haptics';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructorName: string;
  category: string;
  level: string;
  lessonCount: number;
  enrollmentCount: number;
  totalDuration: number;
}

export const CourseCard = memo(function CourseCard({
  id,
  title,
  description,
  thumbnail,
  instructorName,
  category,
  level,
  lessonCount,
  enrollmentCount,
  totalDuration,
}: CourseCardProps) {
  const navigate = useNavigate();
  const avatarColor = getAvatarColor(instructorName);

  const handleClick = () => {
    triggerHaptic('light');
    navigate(`/course/${id}`);
  };

  return (
    <Card 
      className="group cursor-pointer border active:scale-[0.98] transition-all overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <OptimizedImage 
          src={thumbnail}
          alt={title}
          className="w-full h-40 transition-transform group-active:scale-105"
          aspectRatio="16/9"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground shadow-lg border-0 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {lessonCount} lessons
          </Badge>
        </div>
      </div>
      
      <CardHeader className="space-y-3 p-3 pb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border-2 border-background" style={{ backgroundColor: avatarColor }}>
            <AvatarFallback className="text-black dark:text-white font-semibold text-xs">
              {instructorName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardDescription className="text-xs font-medium truncate">{instructorName}</CardDescription>
        </div>
        <CardTitle className="line-clamp-2 text-base leading-snug">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 p-3 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <UsersIcon className="h-3 w-3" />
            {enrollmentCount}
          </span>
          {totalDuration > 0 && (
            <span className="flex items-center gap-1 font-medium">
              <Clock className="h-3 w-3" />
              {totalDuration}m
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-medium border-primary/30">
            {category}
          </Badge>
          <Badge 
            variant="secondary" 
            className={`text-xs capitalize font-medium ${
              level === 'beginner' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
              level === 'intermediate' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
              'bg-rose-500/15 text-rose-600 dark:text-rose-400'
            }`}
          >
            {level}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
});
