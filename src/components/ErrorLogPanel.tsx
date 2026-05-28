import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, Maximize2, X, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ErrorLogPanel() {
  const { theme, systemLogs, setSystemLogs } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Auto expand when there are new logs
  useEffect(() => {
    if (systemLogs) {
      setIsExpanded(true);
    }
  }, [systemLogs]);

  return (
    <>
      <div className={`w-full border-y ${systemLogs ? 'border-red-500/30 bg-[#150505]' : 'border-white/5 bg-black/30'} backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-white/10`}>
        <div 
          className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold select-none cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
             <div className="relative flex h-2 w-2">
              {systemLogs ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              )}
            </div>
            <span className={`text-[11px] tracking-wider uppercase font-black ${systemLogs ? 'text-red-400' : theme.textSecondary}`}>
              Error & Diagnostics Log
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {systemLogs && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/35 font-mono text-red-400 animate-pulse">
                ERRORS
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-4 pb-4 pt-1 border-t border-white/5 font-mono text-[10px] leading-relaxed relative">
                {/* Actions row */}
                <div className="flex justify-end gap-1 mb-2">
                  {systemLogs && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSystemLogs(""); }}
                      className="p-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      title="Xóa logs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                    className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Phóng to"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className={`h-32 overflow-y-auto custom-scrollbar leading-relaxed break-words whitespace-pre-wrap ${systemLogs ? 'text-red-400/80' : 'text-green-400/60'}`}>
                  {systemLogs || "> Hệ thống trạng thái bình thường...\n> Không có lỗi phát sinh."}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-4xl max-h-full flex flex-col rounded-2xl border border-white/10 bg-black/90 shadow-2xl overflow-hidden`}
            >
              <div className={`flex items-center justify-between p-4 border-b border-white/10 bg-white/5`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400">Error & Diagnostics Log</h3>
                    <p className="text-xs text-red-400/60">Bộ theo dõi và xử lý lỗi hệ thống chuyên sâu</p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  {systemLogs && (
                    <button
                      onClick={() => setSystemLogs("")}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Logs
                    </button>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#0f0404]">
                <div className="font-mono text-sm leading-relaxed text-red-400 break-words whitespace-pre-wrap">
                  {systemLogs || "> Hệ thống trạng thái bình thường...\n> Không có lỗi phát sinh."}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
