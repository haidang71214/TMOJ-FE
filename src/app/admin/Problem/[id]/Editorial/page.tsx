// app/(admin)/problems/[problemId]/editorial/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Tabs,
  Tab,
  Textarea,
  Switch,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Input,
  Chip,
} from "@heroui/react";
import { Save, ArrowLeft, Code, BookOpen, AlertTriangle, Upload, Video } from "lucide-react";
import { toast } from "sonner";

interface Editorial {
  id: string;
  problem_id: string;
  content: string;
  hint: string;
  solution_code?: string;
  solution_language: string;
  video_url?: string;           // ← THÊM FIELD NÀY
  is_published: boolean;
  last_edited_at: string;
  last_edited_by: string;
}

export default function ProblemEditorialPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const router = useRouter();

  const [editorial, setEditorial] = useState<Editorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  // Form state
  const [content, setContent] = useState("");
  const [hint, setHint] = useState("");
  const [solutionCode, setSolutionCode] = useState("");
  const [solutionLang, setSolutionLang] = useState("python");
  const [videoUrl, setVideoUrl] = useState("");           // ← URL video (sau upload)
  const [videoFile, setVideoFile] = useState<File | null>(null); // ← File tạm để preview
  const [isPublished, setIsPublished] = useState(false);

  // Mock fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockEditorial: Editorial = {
        id: "ed1",
        problem_id: problemId,
        content: "## Giải thích\n\nĐây là lời giải chi tiết...\n\n```python\ndef two_sum(nums, target):\n    ...\n```",
        hint: "Sử dụng hash map để tra cứu phần bù",
        solution_code: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i",
        solution_language: "python",
        video_url: "", // ban đầu rỗng
        is_published: false,
        last_edited_at: "2026-01-27T11:45:00Z",
        last_edited_by: "admin",
      };

      setEditorial(mockEditorial);
      setContent(mockEditorial.content);
      setHint(mockEditorial.hint || "");
      setSolutionCode(mockEditorial.solution_code || "");
      setSolutionLang(mockEditorial.solution_language);
      setVideoUrl(mockEditorial.video_url || "");
      setIsPublished(mockEditorial.is_published);

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [problemId]);

  // Xử lý chọn file video
  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file (video)
    if (!file.type.startsWith("video/")) {
      toast.error("Vui lòng chọn file video (mp4, webm, mov, ...)");
      return;
    }

    // Kiểm tra kích thước (ví dụ max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video quá lớn (tối đa 100MB)");
      return;
    }

    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file)); // preview local
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Nội dung editorial không được để trống");
      return;
    }

    setSaving(true);

    try {
      // Nếu có file video mới → giả lập upload và lấy URL
      if (videoFile) {
        // Ở đây gọi API upload thật (ví dụ fetch multipart/form-data)
        // const formData = new FormData();
        // formData.append("video", videoFile);
        // const res = await fetch("/api/upload-video", { method: "POST", body: formData });
        // const data = await res.json();
        // finalVideoUrl = data.url;

        // Mock: giữ nguyên local URL cho demo
        toast.info("Video đã được upload (mock)");
      }

      // Mock save toàn bộ
      await new Promise((r) => setTimeout(r, 1200));

      toast.success("Đã lưu editorial thành công!");
      // Reset file sau save nếu cần
      setVideoFile(null);
      // Nếu muốn quay về list: router.push("/problems");
    } catch {
      toast.error("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!editorial && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <AlertTriangle size={64} className="text-amber-500" />
        <h2 className="text-2xl font-bold">Không tìm thấy editorial</h2>
        <p className="text-slate-500 max-w-md">
          Problem này chưa có editorial hoặc bạn không có quyền truy cập.
        </p>
        <Button color="primary" onPress={() => router.push("/problems")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="light" onPress={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">EDITORIAL</h1>
            <p className="text-sm text-slate-500 mt-1">
              Problem ID: <strong>{problemId}</strong> • Last edited by {editorial?.last_edited_by}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Chip color={isPublished ? "success" : "warning"} variant="flat">
            {isPublished ? "Published" : "Draft"}
          </Chip>
          <Switch isSelected={isPublished} onValueChange={setIsPublished} size="sm">
            Publish
          </Switch>
          <Button
            color="primary"
            startContent={<Save size={18} />}
            isLoading={saving}
            onPress={handleSave}
            className="font-bold"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 border-b pb-2",
          tab: "text-base font-semibold",
          cursor: "bg-primary h-1",
        }}
      >
        <Tab key="editor" title="Editor">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left - Content */}
            <Card>
              <CardHeader className="flex justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <BookOpen size={18} />
                  Editorial Content (Markdown)
                </h3>
              </CardHeader>
              <CardBody>
                <Textarea
                  minRows={18}
                  value={content}
                  onValueChange={setContent}
                  placeholder="Viết giải thích chi tiết, ý tưởng, cách tiếp cận..."
                  className="font-mono text-sm"
                />
              </CardBody>
            </Card>

            {/* Right - Hint + Solution + Video */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="font-bold flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Hint
                  </h3>
                </CardHeader>
                <CardBody>
                  <Textarea
                    minRows={4}
                    value={hint}
                    onValueChange={setHint}
                    placeholder="Gợi ý ngắn gọn..."
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-bold flex items-center gap-2">
                    <Code size={18} />
                    Official Solution Code
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Ngôn ngữ"
                    value={solutionLang}
                    onValueChange={setSolutionLang}
                    size="sm"
                  />
                  <Textarea
                    minRows={10}
                    value={solutionCode}
                    onValueChange={setSolutionCode}
                    placeholder="Code mẫu chính thức..."
                    className="font-mono"
                  />
                </CardBody>
              </Card>

              {/* Phần upload video mới */}
              <Card>
                <CardHeader>
                  <h3 className="font-bold flex items-center gap-2">
                    <Video size={18} />
                    Video Giải Thích (tùy chọn)
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="w-full"
                    />
                    <Button
                      variant="flat"
                      startContent={<Upload size={16} />}
                    >
                      Chọn Video
                    </Button>
                  </div>

                  {/* Preview video nếu có */}
                  {videoUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-500 mb-2">Preview:</p>
                      <video
                        src={videoUrl}
                        controls
                        className="w-full max-h-64 rounded-lg border border-slate-300"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        {videoFile ? videoFile.name : "Đã upload trước đó"}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>

        <Tab key="preview" title="Preview">
          <Card>
            <CardBody className="prose dark:prose-invert max-w-none">
              {/* Preview markdown - thay bằng ReactMarkdown thật */}
              <div dangerouslySetInnerHTML={{ __html: "<p>Preview nội dung markdown ở đây...</p>" }} />
              {videoUrl && (
                <div className="mt-6">
                  <h4 className="font-bold">Video Giải Thích</h4>
                  <video src={videoUrl} controls className="w-full max-h-96 rounded-lg" />
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Footer */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="light" onPress={() => router.back()}>
          Cancel
        </Button>
        <Button
          color="primary"
          startContent={<Save size={18} />}
          isLoading={saving}
          onPress={handleSave}
        >
          Save & Exit
        </Button>
      </div>
    </div>
  );
}