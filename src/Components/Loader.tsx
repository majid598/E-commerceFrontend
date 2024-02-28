const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="loading w-32 h-32 rounded-full border-[8px] border-[#ddd] border-t-[#333]"></div>
    </div>
  );
};

export default Loader;

interface SkeletonProps {
  width?: string;
  length?: number;
}

export const Skeleton = ({ width = "unset", length = 3 }: SkeletonProps) => {
  const skeleton = Array.from({ length }, (_,idx) => (
    <div key={idx} className="skeleton-shape h-4 w-full bg-[#ddd] mb-2 rounded-md"></div>
  ));

  return (
    <div className="skeleton-loader flex flex-col mx-auto" style={{ width }}>
     {skeleton}
    </div>
  );
};
