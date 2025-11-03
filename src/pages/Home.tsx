import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, Rocket, Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { mockCourses, mockUsers, Course } from '@/lib/mockData';
import { PullToRefresh } from '@/components/PullToRefresh';
import { CourseCard } from '@/components/CourseCard';
import { triggerHaptic } from '@/lib/haptics';
import { getAvatarColor } from '@/lib/avatarColors';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/student/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    // Load from localStorage or use mock data
    const saved = localStorage.getItem('courses');
    if (saved) {
      setCourses(JSON.parse(saved));
    } else {
      localStorage.setItem('courses', JSON.stringify(mockCourses));
      setCourses(mockCourses);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    await loadCourses();
  };

  // Memoize featured courses
  const featuredCourses = useMemo(() => courses.slice(0, 3), [courses]);
  
  const handleButtonClick = (path: string) => {
    triggerHaptic('light');
    navigate(path);
  };

  // Show loading splash while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative py-12 px-4">
        <div className="w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Launch Your Learning Journey</span>
          </div>
          
          <h1 className="text-3xl font-display font-bold mb-4 leading-tight">
            LearnFlow — Your Department's <span className="text-gradient">Learning Hub</span>
          </h1>
          
          <p className="text-base mb-8 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Empowering departments with structured learning paths, courses, and progress tracking.
          </p>
          
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <Button size="lg" variant="glow" onClick={() => handleButtonClick('/courses')} className="w-full touch-target h-12">
              Explore Courses
              <BookOpen className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => handleButtonClick(user ? '/student/dashboard' : '/login')} className="w-full touch-target h-12">
              Login to Your Account
            </Button>
          </div>
          
          {/* Stats */}
          
        </div>
      </section>

      {/* Features - Mobile Optimized */}
      <section className="py-8 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-1 gap-4">
            <Card className="text-center border shadow-sm">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl educational-gradient text-white mb-3 mx-auto">
                  <BookOpen className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg mb-2">Departmental Organization</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Courses organized by department with role-based access
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border shadow-sm">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl secondary-gradient text-white mb-3 mx-auto">
                  <Users className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg mb-2">Workshop Management</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Interactive workshops with scheduling and attendance
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border shadow-sm">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/70 text-white mb-3 mx-auto">
                  <Award className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg mb-2">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Monitor progress with analytics and certificates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      

      {/* How to Become an Instructor */}
      


      {/* Featured Courses - Mobile Optimized */}
      <section className="py-8 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold mb-2">Featured Courses</h2>
            <p className="text-sm text-muted-foreground">Discover popular learning experiences</p>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Loading courses...</p>
            </div>
          ) : featuredCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No courses available yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {featuredCourses.map((course) => {
                  const instructor = mockUsers.find(u => u.id === course.instructorId);
                  const instructorName = instructor?.name || 'Unknown';
                  
                  return (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      thumbnail={course.thumbnail}
                      instructorName={instructorName}
                      category={course.category}
                      level={course.difficulty}
                      lessonCount={course.lessons?.length || 0}
                      enrollmentCount={course.enrolledStudents?.length || 0}
                      totalDuration={course.lessons?.reduce((acc, l) => {
                        const mins = parseInt(l.duration);
                        return acc + (isNaN(mins) ? 0 : mins);
                      }, 0) || 0}
                    />
                  );
                })}
              </div>
              <div className="text-center mt-6">
                <Button size="lg" variant="secondary" onClick={() => handleButtonClick('/courses')} className="w-full max-w-sm touch-target h-12">
                  View All Courses
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      
      </div>
    </PullToRefresh>
  );
}