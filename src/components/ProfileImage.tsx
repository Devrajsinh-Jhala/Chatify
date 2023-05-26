import React from "react";
import Image from "next/image";
import { VscAccount } from "react-icons/vsc";

type Props = {
  src: string | null | undefined;
  className?: string;
};

const ProfileImage = ({ src, className = "" }: Props) => {
  return (
    <div
      className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
    >
      {src === null ? (
        <VscAccount className="h-full w-full" />
      ) : (
        <Image src={src!} alt="Profile Image" quality={100} fill />
      )}
    </div>
  );
};

export default ProfileImage;
