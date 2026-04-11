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
import { useTranslation } from '@/hooks/useTranslation';

export default function SemesterImportExport() {
  const { t, language } = useTranslation();
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
        title: t('common.success') || (language === 'vi' ? 'Thành công' : 'Success'),
        description: t('semester_management.download_success') || (language === 'vi' ? 'Tải template thành công!' : 'Template downloaded successfully!'),
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
        title: t('common.error') || (language === 'vi' ? 'Lỗi' : 'Error'),
        description: errorMessage === 'Tải template thất bại!' 
          ? (t('semester_management.download_error') || (language === 'vi' ? 'Tải template thất bại!' : 'Failed to download template!')) 
          : errorMessage,
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
        title: t('common.invalid_format') || (language === 'vi' ? 'Lỗi định dạng' : 'Invalid format'),
        description: t('common.excel_only') || (language === 'vi' ? 'Chỉ hỗ trợ file Excel (.xlsx, .xls)' : 'Only Excel files are supported (.xlsx, .xls)'),
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
        title: t('common.success') || (language === 'vi' ? 'Thành công' : 'Success'),
        description: t('semester_management.import_success') || (language === 'vi' ? 'Import danh sách học kỳ thành công!' : 'Semester list imported successfully!'),
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
        title: t('common.error') || (language === 'vi' ? 'Lỗi' : 'Error'),
        description: errorMessage === 'Import thất bại. Vui lòng kiểm tra file!' 
          ? (t('semester_management.import_error') || (language === 'vi' ? 'Import thất bại. Vui lòng kiểm tra file!' : 'Import failed. Please check the file!'))
          : errorMessage,
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
        {t('common.download_template') || (language === 'vi' ? 'TẢI TEMPLATE' : 'DOWNLOAD TEMPLATE')}
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
          {t('common.import') || (language === 'vi' ? 'NHẬP DỮ LIỆU' : 'IMPORT SEMESTERS')}
        </Button>
      </label>
    </div>
  );
}