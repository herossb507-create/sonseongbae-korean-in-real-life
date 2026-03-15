"use client";

// TODO: remark/rehype로 Markdown → HTML 변환
// TODO: 단어 클릭 시 PronunciationPlayer에 텍스트 전달

interface Props {
  content: string;
  chapterId: string;
}

export function ChapterReader({ content }: Props) {
  // 임시 렌더링 — 실제로는 markdown 파서 사용 (remark + rehype)
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <article className="prose prose-slate max-w-none">
      {paragraphs.map((para, i) => {
        if (para.startsWith("# ")) {
          return (
            <h1 key={i} className="text-3xl font-bold text-gray-900 mb-4">
              {para.replace("# ", "")}
            </h1>
          );
        }
        if (para.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-semibold text-gray-800 mt-8 mb-3">
              {para.replace("## ", "")}
            </h2>
          );
        }
        return (
          <p key={i} className="text-gray-700 leading-relaxed mb-4">
            {para}
          </p>
        );
      })}
    </article>
  );
}
