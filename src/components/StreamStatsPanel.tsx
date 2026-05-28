import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Clock, 
  FileText, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Database,
  KeyRound,
  Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function StreamStatsPanel() {
  const { currentStreamStats, isGeneratingStream, theme } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Nhấp nháy nhẹ khi đang streaming
  useEffect(() => {
    let interval: any;
    if (isGeneratingStream) {
      interval = setInterval(() => {
        setPulse(p => !p);
      }, 800);
    } else {
      setPulse(false);
    }
    return () => clearInterval(interval);
  }, [isGeneratingStream]);

  // Tự động mở rộng khi có stream mới bắt đầu để người dùng dễ theo dõi chỉ số trực tiếp
  useEffect(() => {
    if (isGeneratingStream) {
      setIsExpanded(true);
    }
  }, [isGeneratingStream]);

  // Định dạng thời gian hiển thị (giây hoặc phút giây)
  const formatTime = (ms: number | null) => {
    if (ms === null || ms === undefined) return '--';
    const totalSeconds = ms / 1000;
    if (totalSeconds >= 60) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = (totalSeconds % 60).toFixed(0);
      return `${minutes}m ${seconds}s`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Xác định phương thức kết nối
  const getConnectionType = () => {
    if (!currentStreamStats) return 'Mặc định';
    if (currentStreamStats.usedProxy) {
      return `Proxy: ${currentStreamStats.usedProxy.replace('https://', '').replace('http://', '').split('/')[0]}`;
    }
    if (currentStreamStats.usedApiKey) return 'API Key Cá nhân';
    return 'Hệ thống (Web Server)';
  };

  // Sắc thái màu chủ đạo dựa trên theme hiện tại
  const accentColorClass = (theme.accentClass || 'text-white border-white').split(' ')[0];

  return (
    <div className="w-full" id="stream-stats-container">
      <div className="border-y border-white/5 bg-black/30 backdrop-blur-md overflow-hidden transition-all hover:border-white/10">
        
        {/* Nút chính để thu gọn / mở rộng */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold select-none cursor-pointer group"
          id="toggle-stream-stats-btn"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              {isGeneratingStream ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </>
              ) : (
                <span className={`relative inline-flex rounded-full h-2 w-2 ${currentStreamStats ? 'bg-green-500' : 'bg-white/20'}`}></span>
              )}
            </div>
            
            <span className={`text-[11px] tracking-wider uppercase font-black ${isGeneratingStream ? 'text-blue-400' : theme.textSecondary}`}>
              {isGeneratingStream ? 'ĐANG KẾT NỐI AI LITE...' : 'THỐNG KÊ AI STREAM'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isGeneratingStream && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/35 font-mono text-blue-400 animate-pulse">
                LIVE
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
            )}
          </div>
        </button>

        {/* Nội dung thông số */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-4 pb-4 pt-1 border-t border-white/5 font-mono text-[11px] leading-relaxed space-y-2.5">
                
                {/* Trạng thái chính khi chưa có dữ liệu */}
                {!currentStreamStats && !isGeneratingStream ? (
                  <div className="py-2 text-center text-white/30 italic">
                    Chưa có hoạt động AI nào được thực hiện.
                  </div>
                ) : (
                  <>
                    {/* Cổng kết nối */}
                    <div className="flex flex-col gap-1 py-1">
                      <div className="text-white/40 flex items-center gap-1.5 font-semibold">
                        <KeyRound className="w-3 h-3 text-white/30 shrink-0" />
                        Cổng kết nối:
                      </div>
                      <div className="text-left w-full pl-5">
                        <span className="text-white/80 font-medium break-all">
                          {getConnectionType()}
                        </span>
                        {currentStreamStats?.activeApiKey && (
                          <div className="text-[9px] text-green-400 font-bold opacity-80 mt-1 break-all" title={currentStreamStats.activeApiKey}>
                            {currentStreamStats.activeApiKey.substring(0, 10)}...{currentStreamStats.activeApiKey.slice(-4)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dòng Mô hình */}
                    <div className="flex flex-col gap-1 py-1 mb-2">
                      <div className="text-white/40 flex items-center gap-1.5 font-semibold">
                        <Cpu className="w-3 h-3 text-white/30 shrink-0" />
                        Model đang chạy:
                      </div>
                      <div className="text-left text-blue-400 font-semibold break-all pl-5">
                        {currentStreamStats?.model || '--'}
                      </div>
                    </div>

                    {/* Phản hồi phản xạ đầu tiên */}
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-white/30 shrink-0" />
                        Trễ AI:
                      </span>
                      <span className="text-right text-yellow-400/90 font-medium">
                        {formatTime(currentStreamStats?.firstResponseTimeMs || null)}
                      </span>
                    </div>

                    {/* Thời gian xử lí tổng quát */}
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-white/30 shrink-0" />
                        T.gian tổng:
                      </span>
                      <span className="text-right text-white/80">
                        {formatTime(currentStreamStats?.totalTimeMs || null)}
                      </span>
                    </div>

                    {/* Số chữ tiếng Việt */}
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-white/30 shrink-0" />
                        Chữ tạo ra:
                      </span>
                      <span className={`text-right font-bold ${accentColorClass}`}>
                        {currentStreamStats?.vietnameseWordCount || 0} từ
                      </span>
                    </div>

                    {/* Tokens vào/ra */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/50 bg-black/20 p-2 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-widest text-white/30">Token In</span>
                        <span className="font-bold text-white/70">{currentStreamStats?.inputTokens || '--'}</span>
                      </div>
                      <div className="h-6 w-px bg-white/5" />
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] uppercase tracking-widest text-white/30">Token Out</span>
                        <span className="font-bold text-white/70">{currentStreamStats?.outputTokens || '--'}</span>
                      </div>
                    </div>
                  </>
                )}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
