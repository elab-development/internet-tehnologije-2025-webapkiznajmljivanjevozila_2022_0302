import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 z-50
        bg-[#c6a96b] text-black
        w-12 h-12 rounded-full
        flex items-center justify-center
        shadow-lg
        transition-all duration-300

        ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 translate-y-4 pointer-events-none"
        }
        
        hover:scale-110
      `}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
