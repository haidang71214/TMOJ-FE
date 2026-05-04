"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Chip,
  Accordion,
  AccordionItem,
  Divider,
} from "@heroui/react";
import {
  Book,
  Terminal,
  HelpCircle,
  Code2,
  Trophy,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  AlertCircle,
  FileCode2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function WikiPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { t } = useTranslation();

  const verdicts = [
    {
      code: "AC",
      name: "Accepted",
      description: t("wiki_page.judging.verdicts.ac"),
      icon: <CheckCircle2 className="text-emerald-500" size={20} />,
      color: "success",
    },
    {
      code: "WA",
      name: "Wrong Answer",
      description: t("wiki_page.judging.verdicts.wa"),
      icon: <XCircle className="text-rose-500" size={20} />,
      color: "danger",
    },
    {
      code: "TLE",
      name: "Time Limit Exceeded",
      description: t("wiki_page.judging.verdicts.tle"),
      icon: <Clock className="text-amber-500" size={20} />,
      color: "warning",
    },
    {
      code: "MLE",
      name: "Memory Limit Exceeded",
      description: t("wiki_page.judging.verdicts.mle"),
      icon: <Cpu className="text-purple-500" size={20} />,
      color: "secondary",
    },
    {
      code: "CE",
      name: "Compilation Error",
      description: t("wiki_page.judging.verdicts.ce"),
      icon: <AlertCircle className="text-slate-400" size={20} />,
      color: "default",
    },
    {
      code: "RTE",
      name: "Run Time Error",
      description: t("wiki_page.judging.verdicts.rte"),
      icon: <FileCode2 className="text-orange-500" size={20} />,
      color: "warning",
    },
  ];

  const categories = [
    {
      id: "general",
      label: t("wiki_page.tabs.general"),
      icon: <Book size={18} />,
    },
    {
      id: "judging",
      label: t("wiki_page.tabs.judging"),
      icon: <Terminal size={18} />,
    },
    {
      id: "features",
      label: t("wiki_page.tabs.features"),
      icon: <Trophy size={18} />,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#06080F] transition-colors duration-500">
      <div className="max-w-[1000px] mx-auto px-6 py-12 lg:py-20">
        {/* HEADER */}
        <section className="mb-12 space-y-4">
          <div className="flex items-center gap-3 text-[#ff8904]">
            <div className="p-2 rounded-xl bg-[#ff8904]/10">
              <HelpCircle size={24} />
            </div>
            <span className="font-black text-xs uppercase tracking-[0.3em]">{t("wiki_page.knowledge_base")}</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-[#071739] dark:text-white tracking-tighter uppercase">
            TMOJ <span className="text-slate-400">WIKI</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
            {t("wiki_page.subtitle")}
          </p>
        </section>

        {/* NAVIGATION TABS */}
        <div className="sticky top-20 z-30 bg-[#F8FAFC]/80 dark:bg-[#06080F]/80 backdrop-blur-md py-4 mb-8">
          <Tabs
            aria-label="Wiki categories"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            variant="underlined"
            classNames={{
              tabList: "gap-8 border-b border-divider",
              cursor: "bg-[#ff8904]",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#ff8904] font-black uppercase italic text-sm",
            }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat.id}
                title={
                  <div className="flex items-center gap-2">
                    {cat.icon}
                    <span>{cat.label}</span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>

        {/* CONTENT AREA */}
        <div className="space-y-12 pb-20">
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-[#0D121F] border border-divider shadow-sm rounded-3xl overflow-hidden group hover:border-[#ff8904]/50 transition-all">
                  <CardBody className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <Code2 size={24} />
                    </div>
                    <h3 className="text-xl font-black uppercase text-[#071739] dark:text-white">{t("wiki_page.general.problem_title")}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t("wiki_page.general.problem_desc")}
                    </p>
                  </CardBody>
                </Card>

                <Card className="bg-white dark:bg-[#0D121F] border border-divider shadow-sm rounded-3xl overflow-hidden group hover:border-[#ff8904]/50 transition-all">
                  <CardBody className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                      <Trophy size={24} />
                    </div>
                    <h3 className="text-xl font-black uppercase text-[#071739] dark:text-white">{t("wiki_page.general.contest_title")}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t("wiki_page.general.contest_desc")}
                    </p>
                  </CardBody>
                </Card>
              </div>

              <Accordion variant="splitted" className="px-0 gap-4">
                <AccordionItem
                  key="1"
                  aria-label="How to submit?"
                  title={<span className="font-black uppercase text-sm italic">{t("wiki_page.general.how_to_submit")}</span>}
                  subtitle={t("wiki_page.general.how_to_submit_desc")}
                  className="bg-white dark:bg-[#0D121F] border border-divider rounded-2xl"
                >
                  <div className="pb-4 text-sm text-slate-500 dark:text-slate-400 space-y-3">
                    <p>{t("wiki_page.general.submit_step_1")}</p>
                    <p>{t("wiki_page.general.submit_step_2")}</p>
                    <p>{t("wiki_page.general.submit_step_3")}</p>
                    <p>{t("wiki_page.general.submit_step_4")}</p>
                  </div>
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="Ranking rules"
                  title={<span className="font-black uppercase text-sm italic">{t("wiki_page.general.rating_rules")}</span>}
                  subtitle={t("wiki_page.general.rating_rules_desc")}
                  className="bg-white dark:bg-[#0D121F] border border-divider rounded-2xl"
                >
                  <div className="pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {/* Text is already in subtitle for this one, or I could add more here if needed */}
                  </div>
                </AccordionItem>
              </Accordion>
            </motion.div>
          )}

          {activeTab === "judging" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-[#0D121F] border border-divider rounded-[2.5rem] p-8 lg:p-12 shadow-sm">
                <h3 className="text-2xl font-black uppercase text-[#071739] dark:text-white mb-8 flex items-center gap-3">
                  <Terminal className="text-[#ff8904]" /> {t("wiki_page.judging.verdicts_title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {verdicts.map((v) => (
                    <div key={v.code} className="flex gap-4">
                      <div className="mt-1">{v.icon}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-lg">{v.code}</span>
                          <Chip size="sm" variant="flat" color={v.color as any} className="font-bold text-[10px] uppercase">
                            {v.name}
                          </Chip>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                          {v.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex gap-6">
                <AlertCircle className="text-amber-500 shrink-0" size={32} />
                <div className="space-y-2">
                  <h4 className="font-black uppercase text-amber-600 dark:text-amber-400">{t("wiki_page.judging.resource_note_title")}</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300/80 leading-relaxed font-medium">
                    {t("wiki_page.judging.resource_note_desc")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "features" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 font-black text-[10px] uppercase tracking-widest">
                    <Coins size={12} /> {t("wiki_page.features.currency_system")}
                  </div>
                  <h2 className="text-3xl font-black uppercase text-[#071739] dark:text-white tracking-tight">{t("wiki_page.features.coin_title")}</h2>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    {t("wiki_page.features.coin_desc")}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff8904]" />
                      {t("wiki_page.features.coin_usage_1")}
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff8904]" />
                      {t("wiki_page.features.coin_usage_2")}
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff8904]" />
                      {t("wiki_page.features.coin_usage_3")}
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-[400px] aspect-square rounded-[3rem] bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-2xl rotate-3">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-4 border-white/40 shadow-xl">
                        <Coins size={48} strokeWidth={3} />
                      </div>
                      <span className="font-black text-2xl text-white uppercase tracking-tighter">Gold Coins</span>
                   </div>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Trophy size={20} />
                    </div>
                    <h4 className="font-black uppercase text-[#071739] dark:text-white">{t("wiki_page.features.achievements_title")}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t("wiki_page.features.achievements_desc")}
                    </p>
                 </div>
                 <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Book size={20} />
                    </div>
                    <h4 className="font-black uppercase text-[#071739] dark:text-white">{t("wiki_page.features.studyplans_title")}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t("wiki_page.features.studyplans_desc")}
                    </p>
                 </div>
                 <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Terminal size={20} />
                    </div>
                    <h4 className="font-black uppercase text-[#071739] dark:text-white">{t("wiki_page.features.ai_debugger_title")}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t("wiki_page.features.ai_debugger_desc")}
                    </p>
                 </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
