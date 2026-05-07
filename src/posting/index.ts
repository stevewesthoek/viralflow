import { PostingBatch, PostMetadata, UploadOptions, UploadResult, PlatformAdapter } from './types';
import { generateId, getCurrentTimestamp } from '../utils';
import { AccountManager } from '../accounts';

/**
 * Posting orchestrator - routes videos to multiple platforms
 */

export class PostingOrchestrator {
  private adapters: Map<string, PlatformAdapter> = new Map();
  private accountManager: AccountManager;
  private batches: PostingBatch[] = [];

  constructor(accountManager: AccountManager) {
    this.accountManager = accountManager;
  }

  /**
   * Register a platform adapter
   */
  registerAdapter(platform: string, adapter: PlatformAdapter): void {
    this.adapters.set(platform, adapter);
  }

  /**
   * Upload video to single account
   */
  async uploadToAccount(
    accountId: string,
    videoPath: string,
    metadata: PostMetadata
  ): Promise<UploadResult> {
    const account = this.accountManager.getAccount(accountId);
    if (!account) {
      return {
        success: false,
        platform: 'unknown',
        status: 'failed',
        error: `Account ${accountId} not found`,
        uploaded_at: getCurrentTimestamp(),
      };
    }

    const adapter = this.adapters.get(account.platform);
    if (!adapter) {
      return {
        success: false,
        platform: account.platform,
        status: 'failed',
        error: `No adapter registered for platform: ${account.platform}`,
        uploaded_at: getCurrentTimestamp(),
      };
    }

    try {
      const result = await adapter.upload({
        account_id: accountId,
        video_path: videoPath,
        metadata,
      });

      return result;
    } catch (error) {
      return {
        success: false,
        platform: account.platform,
        status: 'failed',
        error: String(error),
        uploaded_at: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Upload video to multiple accounts (batch posting)
   */
  async uploadToAccounts(
    accountIds: string[],
    videoPath: string,
    metadata: PostMetadata,
    seriesId?: string
  ): Promise<UploadResult[]> {
    const batch: PostingBatch = {
      id: generateId('batch'),
      series_id: seriesId,
      account_ids: accountIds,
      video_paths: [videoPath],
      metadata,
      created_at: getCurrentTimestamp(),
      status: 'posting',
      results: [],
    };

    const results: UploadResult[] = [];

    // Post to each account sequentially to avoid rate limits
    for (const accountId of accountIds) {
      const result = await this.uploadToAccount(accountId, videoPath, metadata);
      results.push(result);
      batch.results.push(result);

      // Small delay between posts to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    batch.status = results.every((r) => r.success) ? 'complete' : 'failed';
    this.batches.push(batch);

    return results;
  }

  /**
   * Upload same video to all accounts in a series
   */
  async uploadToSeries(
    seriesId: string,
    videoPath: string,
    metadata: PostMetadata
  ): Promise<UploadResult[]> {
    const series = this.accountManager.getSeries(seriesId);
    if (!series) {
      return [
        {
          success: false,
          platform: 'unknown',
          status: 'failed',
          error: `Series ${seriesId} not found`,
          uploaded_at: getCurrentTimestamp(),
        },
      ];
    }

    return this.uploadToAccounts(series.account_ids, videoPath, metadata, seriesId);
  }

  /**
   * Schedule post for later
   */
  async schedulePost(
    postId: string,
    accountId: string,
    scheduledTime: string
  ): Promise<boolean> {
    const account = this.accountManager.getAccount(accountId);
    if (!account) return false;

    const adapter = this.adapters.get(account.platform);
    if (!adapter) return false;

    try {
      return await adapter.schedule(postId, scheduledTime);
    } catch {
      return false;
    }
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string, accountId: string): Promise<boolean> {
    const account = this.accountManager.getAccount(accountId);
    if (!account) return false;

    const adapter = this.adapters.get(account.platform);
    if (!adapter) return false;

    try {
      return await adapter.delete(postId);
    } catch {
      return false;
    }
  }

  /**
   * Get post statistics
   */
  async getPostStats(postId: string, accountId: string): Promise<Record<string, unknown> | null> {
    const account = this.accountManager.getAccount(accountId);
    if (!account) return null;

    const adapter = this.adapters.get(account.platform);
    if (!adapter) return null;

    try {
      return await adapter.getPostStats(postId);
    } catch {
      return null;
    }
  }

  /**
   * Get posting batches
   */
  getBatches(): PostingBatch[] {
    return this.batches;
  }

  /**
   * Get batch by ID
   */
  getBatch(batchId: string): PostingBatch | null {
    return this.batches.find((b) => b.id === batchId) || null;
  }

  /**
   * Get batch statistics
   */
  getBatchStats(batchId: string) {
    const batch = this.getBatch(batchId);
    if (!batch) return null;

    const successful = batch.results.filter((r) => r.success).length;
    const failed = batch.results.filter((r) => !r.success).length;

    return {
      total: batch.results.length,
      successful,
      failed,
      success_rate: batch.results.length > 0 ? (successful / batch.results.length) * 100 : 0,
      platforms: batch.results.map((r) => r.platform),
    };
  }
}

export { PostingBatch, PostMetadata, UploadOptions, UploadResult, PlatformAdapter };
