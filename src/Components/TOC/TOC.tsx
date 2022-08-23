import { useEffect, useRef, useState } from "react";

type TOSType = {
  selector: string;
};

export const TOC = ({ selector }: TOSType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHeadingID, setCurrentHeadingID] = useState<
    string | undefined
  >();

  const listWrapperRef = useRef<HTMLDivElement>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeListWrapper = (e: any) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeListWrapper, true);
    return () => {
      document.removeEventListener("click", closeListWrapper, true);
    };
  }, []);

  const [headings, setHeadings] = useState<HTMLHeadElement[]>([]);
  useEffect(() => {
    const headingNodeList = document
      .querySelector(selector)!
      .querySelectorAll("h2,h3,h4,h5,h6") as NodeListOf<HTMLHeadElement>;

    if (headingNodeList.length) {
      const headingArray = Array.from(headingNodeList);
      headingArray.forEach((el) => {
        el.dataset.id = Math.round(Math.random() * 100000).toString();
      });
      setHeadings(headingArray);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // if (entry.intersectionRatio > 0.9) {
          // console.log(entry.target.innerHTML, entry.intersectionRatio);
          if (entry.isIntersecting && entry.intersectionRatio >= 1) {
            setCurrentHeadingID((entry.target as HTMLHeadElement).dataset.id);
          }
        });
      },
      {
        rootMargin: "0% 0% -60% 0%",
        threshold: 1,
      }
    );

    if (headings.length) {
      headings.forEach((s) => {
        observer.observe(s);
      });
    }

    return () => {
      return observer.disconnect();
    };
  }, [headings.length]);

  useEffect(() => {
    const element = listWrapperRef.current?.querySelector(
      'button[data-id="' + currentHeadingID + '"]'
    );

    if (currentHeadingID && element) {
      listWrapperRef.current?.scrollTo({
        top: (element as HTMLElement).offsetTop,
        behavior: "smooth",
      });
    }
  }, [currentHeadingID]);

  return (
    <div
      className="sticky z-30 top-0 bg-neutral-50 border-b-2 py-2 text-sm"
      ref={wrapperRef}
    >
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-gray-100 rounded-lg p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            />
          </svg>
        </button>
        <span>Table of Content</span>
      </div>
      <div
        className={`absolute z-50 top-[103%] inset-x-0 bg-neutral-50 drop-shadow rounded-b-2xl overflow-hidden transition-[height] duration-200 ${
          isOpen ? "h-60 visible" : "h-0 invisible"
        }`}
      >
        <div className="p-4 h-full overflow-scroll" ref={listWrapperRef}>
          {headings.map((heading) => {
            const tagLevel = heading.tagName.match(/(\d+)/)?.[0] || "1";
            return (
              <button
                key={heading.dataset.id}
                style={{ paddingLeft: +tagLevel * 7 + "px" }}
                className={`flex w-full my-1 py-2 pr-2  rounded-md font-semibold ${
                  currentHeadingID === heading.dataset.id
                    ? "bg-[#081b4b] text-white"
                    : "hover:bg-gray-100 "
                }`}
                title={heading.innerHTML}
                data-id={heading.dataset.id}
                onClick={() => {
                  window.scrollTo({
                    top:
                      heading.getBoundingClientRect().top + window.scrollY - 60,
                    behavior: "smooth",
                  });
                  setIsOpen(false);
                }}
              >
                {heading.innerHTML}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
