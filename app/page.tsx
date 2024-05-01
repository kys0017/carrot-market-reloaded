import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100 p-5 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100">
      <div className="flex w-full max-w-screen-sm flex-col gap-4 rounded-3xl bg-white p-5 shadow-lg">
        <div className="group flex flex-col">
          <input
            className="w-full bg-gray-100"
            placeholder="Write your email"
          />
          <span className="hidden group-focus-within:block">
            Make sure it is a valid email...
          </span>
          <button className="rounded-my-radius h-[73px] w-full bg-[#543cb8] text-white">
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}
