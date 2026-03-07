import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        toast.error("Failed to enter fullscreen mode");
      }
    } else {
      if (!isLocked) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        toast.warning("Fullscreen is locked. Unlock to exit.", {
          description: "Click the lock icon to unlock",
        });
      }
    }
  }, [isLocked]);

  const toggleLock = useCallback(() => {
    if (!isFullscreen) {
      toast.info("Enter fullscreen first to lock");
      return;
    }
    setIsLocked((prev) => !prev);
    toast.success(isLocked ? "Fullscreen unlocked" : "Fullscreen locked");
  }, [isFullscreen, isLocked]);

  // Listen for fullscreen changes (e.g., user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (!isCurrentlyFullscreen && isLocked) {
        // Re-enter fullscreen if locked
        containerRef.current?.requestFullscreen().catch(() => {
          setIsLocked(false);
          setIsFullscreen(false);
        });
      } else {
        setIsFullscreen(isCurrentlyFullscreen);
        if (!isCurrentlyFullscreen) {
          setIsLocked(false);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isLocked]);

  return {
    isFullscreen,
    isLocked,
    containerRef,
    toggleFullscreen,
    toggleLock,
  };
}
