"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Tabs,
  Tab,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
} from "@heroui/react";
import { 
  Search, 
  Download, 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  Eye, 
  FileCode2, 
  Upload, 
  Database 
} from "lucide-react";

// Mock Data
const MOCK_FILES = [
  { id: "S-10042", type: "submission", fileName: "main.cpp", author: "danghai", size: "2.4 KB", date: "2026-03-08", status: "Active" },
  { id: "S-10043", type: "submission", fileName: "Solution.java", author: "john_doe", size: "3.1 KB", date: "2026-03-07", status: "Archived" },
  { id: "S-10044", type: "submission", fileName: "index.js", author: "alice_w", size: "1.2 KB", date: "2026-03-06", status: "Active" },
  { id: "S-10045", type: "submission", fileName: "script.py", author: "bob_dev", size: "1.8 KB", date: "2026-03-05", status: "Active" },
  { id: "S-10046", type: "submission", fileName: "Main.cs", author: "charlie", size: "4.5 KB", date: "2026-03-04", status: "Active" },
  { id: "S-10047", type: "submission", fileName: "app.ts", author: "diana", size: "3.9 KB", date: "2026-03-03", status: "Archived" },
  { id: "S-10048", type: "submission", fileName: "test.go", author: "evan", size: "2.2 KB", date: "2026-03-02", status: "Active" },
];

const MOCK_TESTSETS = [
  { id: "T-001", problemId: "P-104", fileName: "testcases.zip", size: "45 MB", date: "2025-12-10", version: "v1.2" },
  { id: "T-002", problemId: "P-105", fileName: "high_load.zip", size: "128 MB", date: "2026-01-15", version: "v2.0" },
  { id: "T-003", problemId: "P-106", fileName: "edge_cases.tar.gz", size: "12 MB", date: "2026-02-20", version: "v1.0" },
  { id: "T-004", problemId: "P-108", fileName: "samples.zip", size: "5 MB", date: "2026-03-01", version: "v3.1" },
];

interface StorageFile {
  id: string;
  fileName: string;
  size: string;
  date: string;
  type?: string;
  author?: string;
  status?: string;
  version?: string;
  problemId?: string;
}

export default function FileStoragePage() {
  const [activeTab, setActiveTab] = useState("submissions");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [codeViewerOpen, setCodeViewerOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);

  const handleAction = (action: string, file: StorageFile) => {
    switch(action) {
      case "view":
        setSelectedFile(file);
        setCodeViewerOpen(true);
        break;
      case "download":
        alert(`Downloading ${file.fileName}...`);
        break;
      case "archive":
        alert(`Archived ${file.fileName}`);
        break;
      case "restore":
        alert(`Restored ${file.fileName}`);
        break;
      case "delete":
        if (window.confirm(`Permanently delete ${file.fileName}?`)) {
          alert("Deleted");
        }
        break;
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#071739] dark:text-white">
            File <span className="text-[#00FF41]">Storage</span> & Archive
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500 mt-1">
            Manage code submissions, testsets, and reference solutions
          </p>
        </div>
        
        <div className="flex gap-3">
          <Input 
            placeholder="Search by ID, Name or Author..." 
            startContent={<Search size={16} className="text-slate-400" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
            classNames={{ inputWrapper: "bg-white dark:bg-black/40 w-64 border border-slate-200 dark:border-white/10" }}
          />
          <Button
            className="bg-[#071739] dark:bg-[#00FF41] text-white dark:text-[#071739] font-black shadow-lg"
            startContent={<Upload size={16} />}
            onPress={() => setUploadModalOpen(true)}
          >
            Upload File
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-3xl shadow-sm">
        <Tabs 
          aria-label="Storage Types" 
          variant="underlined"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider px-8 pt-6",
            cursor: "w-full bg-[#00FF41]",
            tab: "max-w-fit px-0 h-12 uppercase italic font-black text-[11px] tracking-widest",
            tabContent: "group-data-[selected=true]:text-[#00FF41]"
          }}
        >
          {/* USER SUBMISSIONS */}
          <Tab 
            key="submissions" 
            title={
              <div className="flex items-center gap-2">
                <FileCode2 size={16}/>
                <span>User Submissions</span>
              </div>
            }
          >
            <CardBody className="p-0">
              <Table aria-label="Submissions Table" removeWrapper className="w-full">
                <TableHeader>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6 pl-8">ID / File</TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6">Author</TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6">Size</TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6">Date</TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6">Status</TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6 pr-8 text-right">Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {MOCK_FILES.map((file) => (
                    <TableRow key={file.id} className="border-t border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${file.status === "Archived" ? "bg-slate-100 text-slate-400 dark:bg-white/5" : "bg-blue-50 text-blue-500 dark:bg-blue-500/10"}`}>
                            <FileCode2 size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-[#071739] dark:text-white leading-tight">{file.fileName}</p>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{file.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-600 dark:text-slate-300">@{file.author}</TableCell>
                      <TableCell className="text-slate-500 text-sm font-medium">{file.size}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{file.date}</TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color={file.status === "Active" ? "success" : "default"} className="font-black text-[10px] uppercase tracking-widest">
                          {file.status}
                        </Chip>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button isIconOnly size="sm" variant="light" onPress={() => handleAction("view", file)}><Eye size={16} className="text-slate-400" /></Button>
                          <Button isIconOnly size="sm" variant="light" onPress={() => handleAction("download", file)}><Download size={16} className="text-blue-500" /></Button>
                          {file.status === "Active" ? (
                            <Button isIconOnly size="sm" variant="light" onPress={() => handleAction("archive", file)}><Archive size={16} className="text-orange-500" /></Button>
                          ) : (
                            <Button isIconOnly size="sm" variant="light" onPress={() => handleAction("restore", file)}><ArchiveRestore size={16} className="text-emerald-500" /></Button>
                          )}
                          <Button isIconOnly size="sm" variant="light" onPress={() => handleAction("delete", file)}><Trash2 size={16} className="text-red-500" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Tab>

          {/* PROBLEM TESTSETS */}
          <Tab 
            key="testsets" 
            title={
              <div className="flex items-center gap-2">
                <Database size={16}/>
                <span>Problem Testsets</span>
              </div>
            }
          >
            <CardBody className="p-0">
               <Table aria-label="Testsets Table" removeWrapper className="w-full">
                <TableHeader>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6 pl-8">Problem / File</TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6">Version</TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6">Size</TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6">Last Updated</TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] tracking-wider py-6 pr-8 text-right">Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {MOCK_TESTSETS.map((testset) => (
                    <TableRow key={testset.id} className="border-t border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-orange-50 text-[#FF5C00] dark:bg-[#FF5C00]/10">
                            <Database size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-[#071739] dark:text-white leading-tight">{testset.fileName}</p>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Problem ID: {testset.problemId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-white/10 font-black text-[10px]">{testset.version}</Chip>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm font-medium">{testset.size}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{testset.date}</TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button isIconOnly size="sm" variant="light" onPress={() => handleAction("download", testset)}><Download size={16} className="text-blue-500" /></Button>
                          <Button isIconOnly size="sm" variant="light" onPress={() => handleAction("delete", testset)}><Trash2 size={16} className="text-red-500" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Tab>
        </Tabs>
      </Card>

      {/* CODE VIEWER MODAL */}
      <Modal isOpen={codeViewerOpen} onOpenChange={setCodeViewerOpen} size="3xl" classNames={{ base: "bg-[#071739] text-white" }}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">{selectedFile?.fileName}</h2>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#00FF41] text-[#071739] font-black">Download</Button>
                <Button size="sm" variant="flat" color="warning">Archive</Button>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium">Author: @{selectedFile?.author} • ID: {selectedFile?.id}</p>
          </ModalHeader>
          <ModalBody className="p-0">
            <div className="bg-[#0A0F1C] p-6 font-mono text-sm text-emerald-400 overflow-x-auto h-[400px]">
              <pre>
{`#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    while(t--) {
        long long n, k;
        cin >> n >> k;
        // Optimized O(1) logic for the problem
        if(k > n/2) cout << n - k << "\\n";
        else cout << k * 2 << "\\n";
    }
    return 0;
}`}
              </pre>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* UPLOAD MODAL */}
      <Modal isOpen={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <ModalContent>
          <ModalHeader className="font-black uppercase tracking-tight">Upload Reference Solution</ModalHeader>
          <ModalBody className="pb-6 space-y-4">
            <Input label="Problem ID" placeholder="e.g. P-101" />
            <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#00FF41] transition-colors">
              <Upload size={32} className="text-slate-400 mb-3" />
              <p className="font-bold text-sm">Click to browse or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">.cpp, .java, .py, .zip up to 50MB</p>
            </div>
            <Textarea label="Notes / Description" placeholder="Optional notes for this file..." />
            <Button size="lg" className="w-full bg-[#00FF41] text-[#071739] font-black mt-4">
              Confirm Upload
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

    </div>
  );
}
