import WordPullUp from "./word-pull-up";

interface WordPullUpDemoProps {
  text: string
}

export const WordPullUpDemo: React.FC<WordPullUpDemoProps> = () => {
  return (
    <WordPullUp
    className="text-3xl md:text-5xl md:text-center font-medium"
      words="Focus areas"
    />
  );
}