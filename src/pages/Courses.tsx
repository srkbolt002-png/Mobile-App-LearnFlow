import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CourseWithStats, getCoursesWithStats } from '@/lib/courseManager';
import { Search } from 'lucide-react';
import { CourseCard } from '@/components/CourseCard';
import { SkeletonList } from '@/components/SkeletonList';
import { PullToRefresh } from '@/components/PullToRefresh';

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const coursesWithStats = await getCoursesWithStats();
    setCourses(coursesWithStats);
    setLoading(false);
  };

  const handleRefresh = async () => {
    await loadCourses();
  };

  // Memoize expensive computations
  const categories = useMemo(
    () => ['all', ...Array.from(new Set(courses.map(c => c.category)))],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, categoryFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background pb-[calc(5rem+var(--sab))]">
        <div className="w-full px-4 py-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-display font-bold mb-2 text-gradient">Course Catalog</h1>
            <p className="text-sm text-muted-foreground">Browse available courses</p>
          </div>
          <SkeletonList count={4} />
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background pb-[calc(5rem+var(--sab))]">
        <div className="w-full px-4 py-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-display font-bold mb-2 text-gradient">Course Catalog</h1>
            <p className="text-sm text-muted-foreground">Browse available courses</p>
          </div>

        <div className="flex flex-col gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-sm border-2 focus:border-primary"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full h-12 text-sm border-2">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              thumbnail={course.thumbnail}
              instructorName={course.instructorName}
              category={course.category}
              level={course.level}
              lessonCount={course.lessonCount}
              enrollmentCount={course.enrollmentCount}
              totalDuration={course.totalDuration}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No courses found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
          </div>
        )}
        </div>
      </div>
    </PullToRefresh>
  );
}
