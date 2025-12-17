export interface SubmissionData {
  id: string;
  status:
    | "Accepted"
    | "Wrong Answer"
    | "Time Limit Exceeded"
    | "Memory Limit Exceeded"
    | "Runtime Error"
    | "Compile Error";
  language: string;
  runtime: string;
  memory: string;
  notes: string;
  timestamp: string;
}
