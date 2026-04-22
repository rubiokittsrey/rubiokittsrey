export type ContentType = 'gallery' | 'project' | 'blog';
export type ContentStatus = 'draft' | 'published';

export interface ContentItem {
    id: string;
    type: ContentType;
    slug: string;
    title: string;
    description: string | null;
    body: string | null;
    cover_image: string | null;
    media: string[];
    tags: string[];
    status: ContentStatus;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export type ContentItemInput = Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>;

export const CONTENT_TYPES: ContentType[] = ['gallery', 'project', 'blog'];
