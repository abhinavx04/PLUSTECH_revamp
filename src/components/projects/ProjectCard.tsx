import React from 'react';
import type { Project } from '../../hooks/useProjectsFirestore';
import { buildYouTubeEmbedUrl } from '../../lib/youtube';

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  const hasVideo = Boolean(project.youtubeVideoId);

  return (
    <a
      href={`/projects/${project.id}`}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition duration-300 flex flex-col"
    >
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        {project.featuredImageUrl ? (
          <img
            src={project.featuredImageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : hasVideo ? (
          <iframe
            title={project.title}
            src={buildYouTubeEmbedUrl(project.youtubeVideoId!)}
            className="w-full h-full"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-50" />
        )}

        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-12 h-12 rounded-full bg-white/90 text-[#00aeef] flex items-center justify-center shadow-lg">
              ▶
            </div>
          </div>
        )}

        {project.category && (
          <span className="absolute top-3 left-3 bg-white/90 text-[#0f172a] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {project.category}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          {project.year && <span>{project.year}</span>}
          {project.location && <span className="truncate max-w-[150px] text-right">{project.location}</span>}
        </div>

        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-bold text-[#0f172a] line-clamp-2">{project.title}</h3>
          <p className="text-slate-600 text-sm line-clamp-3">{project.shortDescription}</p>
        </div>

        {(project.technologies || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).slice(0, 3).map((tech) => (
              <span key={tech} className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                +{(project.technologies || []).length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
};

export default ProjectCard;

