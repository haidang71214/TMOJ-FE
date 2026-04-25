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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Save, ArrowLeft, Code, BookOpen, AlertTriangle, Upload, Video, Sparkles, Eye, Check, X, Pencil, History, FileText } from "lucide-react";
import { toast } from "sonner";

interface Editorial {
  id: string;
  problem_id: string;
  content: string;
  hint: string;
  solution_code?: string;
  solution_language: string;
  video_url?: string;
  is_published: boolean;
  last_edited_at: string;
  last_edited_by: string;
}

interface AiEditorialDraft {
  id: string;
  title: string;
  contentMd: string;
  status: "Draft" | "Accepted" | "Rejected" | "Archived";
  language: string;
  createdAt: string;
  warnings?: string[];
}

export default function ProblemEditorialPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const router = useRouter();

  const [editorial, setEditorial] = useState<Editorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  // AI Draft states
  const [aiDrafts, setAiDrafts] = useState<AiEditorialDraft[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAiDraft, setSelectedAiDraft] = useState<AiEditorialDraft | null>(null);

  // Form state
  const [content, setContent] = useState("");
  const [hint, setHint] = useState("");
  const [solutionCode, setSolutionCode] = useState("");
  const [solutionLang, setSolutionLang] = useState("python");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
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

      // Mock AI Drafts
      const MOCK_AI_DRAFTS: AiEditorialDraft[] = [
        {
          id: "draft-1",
          title: "AI Draft: Two Sum Approach",
          contentMd: "## 1. Problem Understanding\nThe problem asks to find two indices...",
          status: "Draft",
          language: "Vietnamese",
          createdAt: new Date().toISOString(),
          warnings: ["AI generated content may contain errors."],
        },
      ];
      setAiDrafts(MOCK_AI_DRAFTS);

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [problemId]);

  const handleGenerateAiDraft = () => {
    setIsGenerating(true);
    toast.promise(
      new Promise((r) => setTimeout(r, 3000)),
      {
        loading: "AI is analyzing problem and generating draft...",
        success: () => {
          const newDraft: AiEditorialDraft = {
            id: `draft-${Date.now()}`,
            title: `AI Draft: ${new Date().toLocaleTimeString()}`,
            contentMd: "## 1. Problem Understanding\nNew generated content...",
            status: "Draft",
            language: "Vietnamese",
            createdAt: new Date().toISOString(),
          };
          setAiDrafts([newDraft, ...aiDrafts]);
          setIsGenerating(false);
          return "AI Editorial Draft generated successfully!";
        },
        error: "Failed to generate AI draft.",
      }
    );
  };

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
            className="bg-amber-500 text-white font-black"
            startContent={<Sparkles size={18} />}
            isLoading={isGenerating}
            onPress={() => {
              setActiveTab("ai-drafts");
              handleGenerateAiDraft();
            }}
          >
            AI Draft
          </Button>
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
        <Tab
          key="editor"
          title={
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>Editor</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left - Content */}
            <Card>
              <CardHeader className="flex justify-between items-center bg-slate-50/50 dark:bg-white/5 border-b dark:border-white/5 py-3 px-6">
                <div className="flex items-center gap-4">
                  <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-500" />
                    Write Editorial
                  </h3>
                  <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/10" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Markdown Supported
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="shadow"
                  className="bg-linear-to-r from-amber-400 to-[#FF5C00] text-white font-black text-[10px] uppercase h-8 px-4"
                  startContent={<Sparkles size={14} />}
                  onPress={handleGenerateAiDraft}
                  isLoading={isGenerating}
                >
                  Generate with AI
                </Button>
              </CardHeader>
              <CardBody className="relative">
                <Textarea
                  minRows={18}
                  value={content}
                  onValueChange={setContent}
                  placeholder="Viết giải thích chi tiết, ý tưởng, cách tiếp cận..."
                  className="font-mono text-sm"
                />
                {!content && !isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-[1px] z-10 rounded-xl">
                    <Button
                      color="primary"
                      variant="shadow"
                      startContent={<Sparkles size={18} />}
                      onPress={() => {
                        setActiveTab("ai-drafts");
                        handleGenerateAiDraft();
                      }}
                      className="font-black"
                    >
                      Generate with AI
                    </Button>
                  </div>
                )}
              </CardBody>
              <div className="px-6 py-2 border-t dark:border-white/5 bg-slate-50/30 dark:bg-black/10">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Supported: GFM, Tables, MathJax (LaTeX), Images, HTML.
                </p>
              </div>
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
        <Tab
          key="ai-drafts"
          title={
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <span>AI Drafts</span>
            </div>
          }
        >
          <div className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-500" />
                  AI Editorial Assistant
                </h3>
                <p className="text-sm text-slate-500">
                  Generate editorial drafts using AI and review them before publishing.
                </p>
              </div>
              <Button
                color="primary"
                variant="shadow"
                startContent={<Sparkles size={18} />}
                onPress={handleGenerateAiDraft}
                isLoading={isGenerating}
                className="font-black"
              >
                Generate AI Draft
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiDrafts.length === 0 ? (
                <Card className="col-span-full border-2 border-dashed border-slate-200 dark:border-white/10 bg-transparent shadow-none">
                  <CardBody className="py-12 flex flex-col items-center justify-center gap-4">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-white/5">
                      <FileText size={32} className="text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-600 dark:text-slate-300">No AI drafts yet</p>
                      <p className="text-sm text-slate-400">Click the button above to generate your first draft.</p>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                aiDrafts.map((draft) => (
                  <Card key={draft.id} className="border dark:border-white/10 hover:shadow-md transition-shadow">
                    <CardHeader className="flex justify-between items-start pb-0">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                          {new Date(draft.createdAt).toLocaleString()}
                        </span>
                        <h4 className="font-black text-lg mt-1">{draft.title}</h4>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={draft.status === "Accepted" ? "success" : draft.status === "Rejected" ? "danger" : "warning"}
                        className="font-black text-[10px] uppercase"
                      >
                        {draft.status}
                      </Chip>
                    </CardHeader>
                    <CardBody>
                      <p className="text-sm text-slate-500 line-clamp-3 italic mb-4">
                        {draft.contentMd}
                      </p>
                      {draft.warnings && (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 mb-4">
                          {draft.warnings.map((w, i) => (
                            <p key={i} className="text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-bold">
                              <AlertTriangle size={12} /> {w}
                            </p>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-end gap-2 pt-2 border-t dark:border-white/5">
                        <Button
                          size="sm"
                          variant="flat"
                          startContent={<Eye size={14} />}
                          onPress={() => setSelectedAiDraft(draft)}
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          startContent={<Pencil size={14} />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-500 text-white font-bold"
                          startContent={<Check size={14} />}
                          onPress={() => {
                            setContent(draft.contentMd);
                            setActiveTab("editor");
                            toast.success("AI Draft content has been copied to editor!");
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          isIconOnly
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </div>
        </Tab>

        <Tab
          key="preview"
          title={
            <div className="flex items-center gap-2">
              <Eye size={18} />
              <span>Preview</span>
            </div>
          }
        >
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

      {/* AI Draft Preview Modal */}
      <Modal
        isOpen={!!selectedAiDraft}
        onClose={() => setSelectedAiDraft(null)}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <span className="font-black italic uppercase text-lg">AI Draft Preview</span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              {selectedAiDraft?.title} • {selectedAiDraft?.language}
            </p>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="prose dark:prose-invert max-w-none">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-black/20 border dark:border-white/5">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {selectedAiDraft?.contentMd}
                </pre>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setSelectedAiDraft(null)}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={() => {
                if (selectedAiDraft) {
                  setContent(selectedAiDraft.contentMd);
                  setActiveTab("editor");
                  setSelectedAiDraft(null);
                  toast.success("AI Draft content has been copied to editor!");
                }
              }}
            >
              Use this Draft
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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