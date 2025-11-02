import { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { mockCourses, Course } from '@/lib/mockData';
import { Clock, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { initializeCourseProgress, getCourseProgress } from '@/lib/progressManager';
import { PullToRefresh } from '@/components/PullToRefresh';
import { OptimizedImage } from '@/components/OptimizedImage';
import { triggerHaptic } from '@/lib/haptics';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  const loadCourses = () => {
    const saved = localStorage.getItem('courses');
    if (saved) {
      setCourses(JSON.parse(saved));
    } else {
      localStorage.setItem('courses', JSON.stringify(mockCourses));
      setCourses(mockCourses);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleRefresh = async () => {
    loadCourses();
  };

  // Memoize enrolled courses computation
  useEffect(() => {
    if (user && courses.length > 0) {
      const enrolled = courses.filter(course => 
        course.enrolledStudents.includes(user.id)
      );
      setEnrolledCourses(enrolled);
      
      // Initialize progress tracking for enrolled courses
      enrolled.forEach(course => {
        const existingProgress = getCourseProgress(user.id, course.id);
        if (!existingProgress) {
          const lessonIds = course.lessons.map(l => l.id);
          initializeCourseProgress(user.id, course.id, lessonIds);
        }
      });
    }
  }, [user, courses]);

  const handleCourseClick = (courseId: string) => {
    triggerHaptic('light');
    navigate(`/course/${courseId}`);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-background pb-[calc(5rem+var(--sab))]">
        <div className="w-full px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold mb-2">My Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">My Courses</h2>
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {enrolledCourses.length}
            </Badge>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="space-y-3">
              {enrolledCourses.map((course) => (
                <Card 
                  key={course.id} 
                  className="cursor-pointer border active:scale-[0.98] transition-transform"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="flex gap-3 p-3">
                    <OptimizedImage 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-20 h-20 rounded flex-shrink-0"
                      aspectRatio="1/1"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{course.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        <span>{course.lessons.length} lessons</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs capitalize ${
                          course.difficulty === 'beginner' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                          course.difficulty === 'intermediate' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                          'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {course.difficulty}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                  <BookOpen className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-1">No Courses Yet</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Start learning by browsing courses
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/courses')}
                >
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </PullToRefresh>
  );
}
