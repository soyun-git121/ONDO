import { Link } from "react-router-dom";
import CardImage from "./CardImage";
import { PROJECT_TYPE_LABEL, type ProjectType } from "../../types/project";

interface Props {
  slug: string;
  title: string;
  type: ProjectType;
  resultMetric: string | null;
  thumbnailUrl: string | null;
  clientName?: string | null;
}

/** ArtisanCard 규격 상속 + resultMetric을 brand-secondary 하이라이트로 강조 (design.md §3) */
export default function ProjectCard({ slug, title, type, resultMetric, thumbnailUrl, clientName }: Props) {
  return (
    <Link
      to={`/projects/${slug}`}
      className="group block overflow-hidden rounded-md bg-surface shadow-1 transition-shadow duration-fast hover:shadow-2 active:scale-[0.98]"
    >
      <CardImage src={thumbnailUrl} alt={title} />
      <div className="flex flex-col gap-2 p-4">
        <span className="w-fit rounded-pill bg-surface-muted px-3 py-1 text-xs">
          {PROJECT_TYPE_LABEL[type]}
        </span>
        <span className="text-lg font-bold">{title}</span>
        {clientName && <span className="text-sm text-text-muted">{clientName}</span>}
        {resultMetric && (
          <span className="w-fit bg-secondary px-2 py-0.5 text-sm font-medium text-text-primary">
            {resultMetric}
          </span>
        )}
      </div>
    </Link>
  );
}
