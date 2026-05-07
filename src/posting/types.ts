/**
 * Platform posting and upload types
 */

export interface PostMetadata {
  title: string;
  description?: string;
  tags?: string[];
  thumbnail_url?: string;
  published_at?: string;
  scheduled_for?: string;
  visibility?: 'public' | 'private' | 'unlisted' | 'followers-only';
}

export interface UploadResult {
  success: boolean;
  platform: string;
  post_id?: string;
  url?: string;
  status: 'pending' | 'uploading' | 'published' | 'failed';
  error?: string;
  uploaded_at: string;
}

export interface UploadOptions {
  account_id: string;
  video_path: string;
  metadata: PostMetadata;
  series_id?: string;
  auto_schedule?: boolean;
  notify_on_complete?: boolean;
}

export interface PlatformAdapter {
  platform: string;
  upload(options: UploadOptions): Promise<UploadResult>;
  schedule(postId: string, scheduledTime: string): Promise<boolean>;
  delete(postId: string): Promise<boolean>;
  getPostStats(postId: string): Promise<Record<string, unknown>>;
}

export interface PostingBatch {
  id: string;
  series_id?: string;
  account_ids: string[];
  video_paths: string[];
  metadata: PostMetadata;
  created_at: string;
  status: 'draft' | 'scheduled' | 'posting' | 'complete' | 'failed';
  results: UploadResult[];
}
