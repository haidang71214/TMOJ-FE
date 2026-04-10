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

  const currentSemester = useMemo<SemesterItem | null>(() => {
    if (!data?.data?.items || data.data.items.length === 0) return null;
    
    const items = data.data.items;

    // 1. Ưu tiên kì có isActive = true
    const activeSemester = items.find((s) => s.isActive);
    if (activeSemester) return activeSemester;

    // 2. Fallback tìm kì dựa theo thời gian Date.now()
    const now = Date.now();
    const currentByDate = items.find((s) => {
      const start = new Date(s.startAt).getTime();
      const end = new Date(s.endAt).getTime();
      return now >= start && now <= end;
    });
    if (currentByDate) return currentByDate;

    // 3. Fallback lấy kì cuối cùng
    return items[items.length - 1];
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
