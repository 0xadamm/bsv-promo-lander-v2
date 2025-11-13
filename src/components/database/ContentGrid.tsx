import { Content, Sport, Ailment } from "@/types/database";
import ContentCard from "./ContentCard";

interface ContentGridProps {
  content: Content[];
  sports: Sport[];
  ailments: Ailment[];
  onContentClick: (content: Content) => void;
}

export default function ContentGrid({
  content,
  sports,
  ailments,
  onContentClick,
}: ContentGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {content.map((item) => (
        <ContentCard
          key={item._id.toString()}
          content={item}
          sports={sports}
          ailments={ailments}
          onClick={() => onContentClick(item)}
        />
      ))}
    </div>
  );
}
