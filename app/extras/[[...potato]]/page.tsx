import HackedComponent from "@/components/hacked-component";
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from "react";

async function getData() {
  const keys = {
    apiKey: "1234567890",
    secretKey: "0987654321",
  };

  // experimental_taintObjectReference("API keys were leaked!", keys);
  experimental_taintUniqueValue("Secret key was exposed", keys, keys.secretKey);
  return keys;
}

export default async function Extras({
  params,
}: {
  params: { potato: string[] };
}) {
  const data = await getData();
  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="text-6xl">Extras!</h1>
      <h2>So much more to learn!</h2>
      <HackedComponent data={data} />
    </div>
  );
}
