import { SectionTitleProps } from "./types";

const SectionTitle = ({ text }: SectionTitleProps) => {
  return (
    <div className="flex items-center gap-1 h-9 flex-1">
      <span className="text-[#AAAAAA] text-xs font-normal leading-[1.67]">
        {text}
      </span>
    </div>
  );
};

export default SectionTitle;
