import { ContentLayout } from "@/components/admin-panel/content-layout";
import { createClient } from "@/lib/supabase/server";

const MyCoursesPage = async () => {
  const supabase = await createClient();
  // select from the courses table in supabase
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*");
  console.log("Courses:", courses);

  if (error) {
    console.error("Error fetching courses:", error);
    return <div>Error loading courses</div>;
  }
  return (
    <ContentLayout title="MyCoursesPage">
      <div>MyCoursesPage</div>
    </ContentLayout>
  );
}
export default MyCoursesPage