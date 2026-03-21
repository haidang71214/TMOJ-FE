
export interface ProblemAttemptDTO {
  problemId: string;       // Bảng chữ cái hoặc ID bài (VD: "A", "B")
  isSolved: boolean;       // Đã giải được chưa?
  isFirstBlood: boolean;   // Có phải người giải đầu tiên của bài này không?
  attemptsCount: number;   // Tổng số lần nộp bài (bao gồm cả đúng và sai)
  penaltyTime?: number;    // Thời gian tính phạt (phút) lúc giải thành công
  pendingCount?: number;   // Số lượng bài đang chấm dỡ (Pending)
}
export interface ScoreboardRowDTO {
  rank: number;            // Hạng hiện tại
  userId: string;          // ID thí sinh
  username: string;        // Tên hiển thị / Tên tài khoản
  avatarUrl?: string;      // Ảnh đại diện (nếu có)
  fullname?: string;       // Họ và tên thật (nếu cần hiển thị)
  totalSolved: number;     // Tổng số bài giải được
  totalPenalty: number;    // Tổng thời gian phạt (Penalty)
  problems: ProblemAttemptDTO[]; // Danh sách trạng thái từng bài
}
export interface ContestProblemHeaderDTO {
  id: string;              // "A", "B", "C"...
  title: string;           // "Area Query", "Awesome MST Problem"...
  balloonColor?: string;   // Mã màu Hex cho bóng bay ICPC (VD: "#ff0000")
  solvedCount: number;     // Số người/đội đã giải được bài này
  totalAttempts: number;   // Tổng số lần nộp bài của tất cả mọi người cho bài này
}

/**
 * DTO tổng tổng hợp toàn bộ dữ liệu trả về cho trang Scoreboard
 */
export interface ScoreboardResponseDTO {
  contestId: string;
  contestName: string;
  status: "upcoming" | "running" | "ended";
  frozen: boolean;         // Bảng xếp hạng có đang bị đóng băng (Freeze) không?
  problems: ContestProblemHeaderDTO[]; // Danh sách bài trên header
  rows: ScoreboardRowDTO[];            // Dữ liệu từng dòng của bảng xếp hạng
  lastUpdated: string;     // ISO 8601 Timestamp lần cập nhật cuối
}
