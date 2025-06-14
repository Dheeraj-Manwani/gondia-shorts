import { PulseLoader } from "react-spinners";

// export const HalfScreenLoader = () => {
//   return (
//     <div className="w-full h-36 flex">
//       <LoaderCircle className="animate-spin h-10 w-10 m-auto text-blue-700" />
//     </div>
//   );
// };

export const BrandLoader = () => {
  return (
    <div className="w-full h-30 flex justify-center items-center text-zinc-600">
      <PulseLoader
        speedMultiplier={1.3}
        size={15}
        color="#52525c"
        className="mb-7"
      />
    </div>
  );
};

export const MiniBrandLoader = () => {
  return (
    <div className="w-full h-10 flex text-zinc-600 mt-2 ml-3">
      <PulseLoader speedMultiplier={1.3} size={5} color="#52525c" />
    </div>
  );
};
