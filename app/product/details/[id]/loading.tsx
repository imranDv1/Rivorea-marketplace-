import { Skeleton } from "@/components/ui/skeleton";

const LoadingProductDetails = () => {
  return (
    <div className="flex flex-col gap-20">
      {/* Product details section */}
      <div className="w-[90%] mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 items-center gap-20">
        <div className="flex flex-col gap-9">
          <Skeleton className="h-[40px] w-[300px] rounded" /> {/* Title */}
          <Skeleton className="h-[30px] w-[80%] rounded" /> {/* Description */}
          <div className="flex items-center gap-7">
            <Skeleton className="h-[24px] w-[80px] rounded" /> {/* Price */}
            <Skeleton className="h-[24px] w-[120px] rounded" /> {/* Category */}
          </div>
          <Skeleton className="h-[50px] w-[180px] rounded" /> {/* Add to Cart Button */}
        </div>
        {/* Carousel skeleton */}
        <div className="w-full md:w-[80%] mx-auto flex gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full h-64 sm:h-72 md:h-80 rounded-md" />
          ))}
        </div>
      </div>

      {/* Related products section */}
      <div className="w-[90%] flex flex-col gap-5 mx-auto pb-20">
        <Skeleton className="h-[34px] w-[220px] rounded" /> {/* All products title */}
        <Skeleton className="h-[20px] w-[300px] rounded" /> {/* Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 justify-start">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full md:w-[320px] bg-transparent border-0 p-0">
              <div className="p-0">
                <Skeleton className="w-full h-[250px] rounded-2xl" /> {/* Thumbnail */}
              </div>
              <div className="p-0 flex flex-col gap-2 mt-2">
                <Skeleton className="h-[28px] w-[120px] rounded" /> {/* Product title */}
                <Skeleton className="h-[20px] w-[90%] rounded" /> {/* Description */}
                <Skeleton className="h-[24px] w-[60px] rounded" /> {/* Price */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingProductDetails;