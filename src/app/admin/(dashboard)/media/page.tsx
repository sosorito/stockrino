import { getAllMedia } from "@/lib/data/media";
import { MediaLibrary } from "@/components/admin/media-library";

export const metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  const media = await getAllMedia();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Media Library</h1>
        <p className="text-slate-500 text-sm mt-1">Upload and manage images used across your blog posts.</p>
      </div>
      <MediaLibrary initial={media as any} />
    </div>
  );
}
