import Image from "next/image";
import heavyImage from "../../../public/heavy-image.jpg";

export default async function Extras() {
  return (
    <div className="flex flex-col gap-3 py-10">
      <Image
        src={heavyImage}
        alt="heavy-image"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,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"
      />
    </div>
  );
}