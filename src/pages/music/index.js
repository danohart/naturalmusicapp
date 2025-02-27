// pages/music/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function MusicIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/music/1");
  }, []);

  return null;
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
