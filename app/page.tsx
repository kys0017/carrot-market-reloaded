import Image from "next/image";

export default function Home() {
  return (
    <main
      className="flex h-screen items-center justify-center bg-gray-100 p-5
    sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100"
    >
      <div
        className="flex w-full max-w-screen-sm flex-col gap-2 rounded-3xl bg-white p-5 shadow-lg ring 
        ring-transparent
        transition-shadow *:outline-none has-[.peer]:bg-green-100
        has-[:invalid]:ring-red-100
        md:flex-row
      "
      >
        <input
          className="peer
          h-12 w-full rounded-full bg-gray-200
          pl-5 ring ring-transparent transition-shadow placeholder:drop-shadow focus:ring-orange-500
          invalid:focus:ring-green-500"
          type="text"
          required
          placeholder="Email address"
        />
        <span className="hidden font-medium text-red-500 peer-invalid:block">
          Email is required.
        </span>
        <button
          className="
          rounded-full
          bg-black
          py-2 font-medium text-white 
           transition-transform active:scale-90 md:px-10
        "
        >
          Log in
        </button>
      </div>
    </main>
  );
}
