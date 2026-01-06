import { TooltipProps } from './types';

const Tooltip = ({ text, show }: TooltipProps) => {
  if (!show) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
      <div className="bg-[#212121] text-[#F9F9F9] text-xs font-normal leading-[1.67] px-2 py-1 rounded-lg whitespace-nowrap h-[26px] flex items-center">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
          <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[#212121]"></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;

