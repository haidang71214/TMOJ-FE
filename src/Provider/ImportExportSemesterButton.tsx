'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import {  Upload, FileSpreadsheet } from 'lucide-react';
import { addToast } from '@heroui/toast';

import { 
  useGetSemesterImportTemplateMutation, 
  useImportSemestersMutation 
} from '@/store/queries/Semester';
import { ErrorForm } from '@/types';

export default function SemesterImportExport() {
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const [getTemplate] = useGetSemesterImportTemplateMutation();
  const [importSemesters] = useImportSemestersMutation();

  // Tải Template Import
  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const blob = await getTemplate().unwrap();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template_import_hoc_ky.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      addToast({
        title: "Thành công",
        description: "Tải template thành công!",
        color: "success",
      });
    } catch (error: unknown) {
      console.error(error);

      let errorMessage = 'Tải template thất bại!';

      if (error && typeof error === 'object' && 'data' in error) {
        const err = error as ErrorForm;
        errorMessage = err.data?.data?.message || errorMessage;
      }

      addToast({
        title: "Lỗi",
        description: errorMessage,
        color: "danger",
      });
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  // Import file
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      addToast({
        title: "Lỗi định dạng",
        description: "Chỉ hỗ trợ file Excel (.xlsx, .xls)",
        color: "warning",
      });
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await importSemesters(formData).unwrap();

      addToast({
        title: "Thành công",
        description: "Import danh sách học kỳ thành công!",
        color: "success",
      });

      e.target.value = '';
    } catch (error: unknown) {
      console.error(error);

      let errorMessage = 'Import thất bại. Vui lòng kiểm tra file!';

      if (error && typeof error === 'object' && 'data' in error) {
        const err = error as ErrorForm;
        errorMessage = err.data?.data?.message || errorMessage;
      }

      addToast({
        title: "Lỗi",
        description: errorMessage,
        color: "danger",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Nút Tải Template */}
      <Button
        startContent={<FileSpreadsheet size={20} strokeWidth={3} />}
        onPress={handleDownloadTemplate}
        isLoading={isDownloadingTemplate}
        className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
      >
        TẢI TEMPLATE
      </Button>

      {/* Nút Import */}
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleImport}
          className="hidden"
        />
        <Button
          startContent={<Upload size={20} strokeWidth={3} />}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
        >
          IMPORT SEMESTERS
        </Button>
      </label>
    </div>
  );
}