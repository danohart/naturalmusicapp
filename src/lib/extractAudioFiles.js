import { parse } from "node-html-parser";

export default function extractAudioFiles(renderedContent) {
  const isServer = typeof window === "undefined";
  let audioFiles = [];

  try {
    if (isServer) {
      // Server-side: Use node-html-parser
      const root = parse(renderedContent);

      // Find all audio elements
      const audioElements = root.querySelectorAll("audio");

      audioElements.forEach((audio) => {
        const url = audio.getAttribute("src");

        if (url) {
          let label = "";
          const figure = audio.closest("figure");
          const prevElement = figure ? figure.previousElementSibling : null;

          if (prevElement && prevElement.tagName === "P") {
            label = prevElement.text.trim();
          }

          audioFiles.push({
            url: url,
            label: label || "Audio Track",
          });
        }
      });
    } else {
      // Client-side: Use browser DOM
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = renderedContent;

      const audioElements = tempDiv.querySelectorAll("audio");

      audioElements.forEach((audio) => {
        const url = audio.getAttribute("src");

        if (url) {
          let label = "";
          let prevElement = audio.closest("figure")?.previousElementSibling;

          if (prevElement && prevElement.tagName === "P") {
            label = prevElement.textContent.trim();
          }

          audioFiles.push({
            url: url,
            label: label || "Audio Track",
          });
        }
      });
    }
  } catch (error) {
    console.error("Error extracting audio files:", error);
    return [];
  }

  return audioFiles;
}
