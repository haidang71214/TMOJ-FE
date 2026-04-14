import { useGetSemestersQuery, useGetSemesterDetailQuery } from "@/store/queries/Semester";
import { useMemo } from "react";
import { SemesterItem } from "@/types";

/**
 * Hook giúp xác định kì học hiện tại dựa trên danh sách các kì học public.
 * Ưu tiên:
 * 1. Kì học có cờ `isActive = true`
 * 2. Kì học có thời gian (startAt - endAt) chứa thời điểm hiện tại
 * 3. Kì học cuối cùng trong danh sách
 */
export function useCurrentSemester() {
  const { data, isLoading, error, refetch } = useGetSemestersQuery();
  console.log(data);
  const currentSemester = useMemo<SemesterItem | null>(() => {
    if (!data?.data?.items || data.data.items.length === 0) return null;
    
    const items = data.data.items;

    const now = Date.now();

    const getDistance = (s: SemesterItem) => {
      const start = new Date(s.startAt).setHours(0, 0, 0, 0);
      const end = new Date(s.endAt).setHours(23, 59, 59, 999);
      if (now >= start && now <= end) return 0; // Đang diễn ra
      if (now < start) return start - now; // Sắp diễn ra
      return now - end; // Đã qua
    };

    // Ưu tiên chỉ xét những kì đang được bật (isActive = true)
    const activeItems = items.filter((s) => s.isActive);

    if (activeItems.length > 0) {
      // Sắp xếp theo khoảng cách thời gian gần hiện tại nhất
      activeItems.sort((a, b) => getDistance(a) - getDistance(b));
      return activeItems[0];
    }

    // Fallback: nếu không có kì nào active, lấy kì bất kỳ gần hiện tại nhất
    const allSorted = [...items].sort((a, b) => getDistance(a) - getDistance(b));
    return allSorted[0] || null;
  }, [data]);

  return {
    currentSemester,
    semesters: data?.data?.items || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook để lấy chi tiết một kì học nếu cần
 */
export function useSemesterDetail(semesterId?: string) {
  return useGetSemesterDetailQuery(
    { id: semesterId as string },
    { skip: !semesterId }
  );
}
