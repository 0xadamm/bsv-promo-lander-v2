import { Content, Sport, Ailment } from "@/types/database";
import ContentCard from "./ContentCard";
import Masonry from "react-masonry-css";

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
  const breakpointColumns = {
    default: 3,
    1280: 3,  // xl
    1024: 2,  // lg
    640: 1,   // sm
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex gap-6 -ml-6"
      columnClassName="pl-6 bg-clip-padding"
    >
      {content.map((item) => (
        <div key={item._id.toString()} className="mb-6">
          <ContentCard
            content={item}
            sports={sports}
            ailments={ailments}
            onClick={() => onContentClick(item)}
          />
        </div>
      ))}
    </Masonry>
  );
}
