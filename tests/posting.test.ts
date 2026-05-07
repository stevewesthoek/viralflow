import { PostingOrchestrator } from '../src/posting';
import { AccountManager } from '../src/accounts';
import { PlatformAdapter, PostMetadata, UploadResult } from '../src/posting/types';

/**
 * Mock adapter for testing
 */
class MockAdapter implements PlatformAdapter {
  platform: string;

  constructor(platform: string) {
    this.platform = platform;
  }

  async upload(): Promise<UploadResult> {
    return {
      success: true,
      platform: this.platform,
      post_id: `post-${Math.random()}`,
      url: `https://${this.platform}.example.com/video/123`,
      status: 'published',
      uploaded_at: new Date().toISOString(),
    };
  }

  async schedule(): Promise<boolean> {
    return true;
  }

  async delete(): Promise<boolean> {
    return true;
  }

  async getPostStats(): Promise<Record<string, unknown>> {
    return {
      views: 1000,
      likes: 100,
      comments: 50,
      shares: 25,
    };
  }
}

describe('Posting System', () => {
  describe('PostingOrchestrator', () => {
    test('registers platform adapters', () => {
      const accountManager = new AccountManager();
      const orchestrator = new PostingOrchestrator(accountManager);

      const adapter = new MockAdapter('youtube');
      orchestrator.registerAdapter('youtube', adapter);

      // Verify by attempting an upload
      expect(() => {
        orchestrator.registerAdapter('youtube', adapter);
      }).not.toThrow();
    });

    test('uploads to single account', async () => {
      const accountManager = new AccountManager();
      const account = accountManager.addAccount('Test', 'youtube', '@test', {});

      const orchestrator = new PostingOrchestrator(accountManager);
      orchestrator.registerAdapter('youtube', new MockAdapter('youtube'));

      const metadata: PostMetadata = {
        title: 'Test Video',
        description: 'Test description',
      };

      const result = await orchestrator.uploadToAccount(account.id, '/path/to/video.mp4', metadata);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('youtube');
      expect(result.post_id).toBeDefined();
    });

    test('returns error for non-existent account', async () => {
      const accountManager = new AccountManager();
      const orchestrator = new PostingOrchestrator(accountManager);

      const result = await orchestrator.uploadToAccount('nonexistent', '/path/to/video.mp4', {
        title: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('returns error for unregistered platform', async () => {
      const accountManager = new AccountManager();
      const account = accountManager.addAccount('Test', 'tiktok', '@test', {});

      const orchestrator = new PostingOrchestrator(accountManager);

      const result = await orchestrator.uploadToAccount(account.id, '/path/to/video.mp4', {
        title: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('No adapter');
    });

    test('uploads to multiple accounts', async () => {
      const accountManager = new AccountManager();
      const account1 = accountManager.addAccount('YouTube', 'youtube', '@yt', {});
      const account2 = accountManager.addAccount('TikTok', 'tiktok', '@tk', {});

      const orchestrator = new PostingOrchestrator(accountManager);
      orchestrator.registerAdapter('youtube', new MockAdapter('youtube'));
      orchestrator.registerAdapter('tiktok', new MockAdapter('tiktok'));

      const results = await orchestrator.uploadToAccounts(
        [account1.id, account2.id],
        '/path/to/video.mp4',
        {
          title: 'Test Video',
        }
      );

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.success)).toBe(true);
    });

    test('uploads to series', async () => {
      const accountManager = new AccountManager();
      const account1 = accountManager.addAccount('A1', 'youtube', '@a1', {});
      const account2 = accountManager.addAccount('A2', 'tiktok', '@a2', {});

      const series = accountManager.createSeries('Test Series', 'Desc', [account1.id, account2.id]);

      const orchestrator = new PostingOrchestrator(accountManager);
      orchestrator.registerAdapter('youtube', new MockAdapter('youtube'));
      orchestrator.registerAdapter('tiktok', new MockAdapter('tiktok'));

      const results = await orchestrator.uploadToSeries(series.id, '/path/to/video.mp4', {
        title: 'Series Video',
      });

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.success)).toBe(true);
    });

    test('returns error for non-existent series', async () => {
      const accountManager = new AccountManager();
      const orchestrator = new PostingOrchestrator(accountManager);

      const results = await orchestrator.uploadToSeries('nonexistent', '/path/to/video.mp4', {
        title: 'Test',
      });

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
    });

    test('tracks posting batches', async () => {
      const accountManager = new AccountManager();
      const account = accountManager.addAccount('Test', 'youtube', '@test', {});

      const orchestrator = new PostingOrchestrator(accountManager);
      orchestrator.registerAdapter('youtube', new MockAdapter('youtube'));

      await orchestrator.uploadToAccounts([account.id], '/path/to/video.mp4', { title: 'Test' });

      const batches = orchestrator.getBatches();
      expect(batches).toHaveLength(1);
      expect(batches[0].results).toHaveLength(1);
    });

    test('gets batch by ID', async () => {
      const accountManager = new AccountManager();
      const account = accountManager.addAccount('Test', 'youtube', '@test', {});

      const orchestrator = new PostingOrchestrator(accountManager);
      orchestrator.registerAdapter('youtube', new MockAdapter('youtube'));

      await orchestrator.uploadToAccounts([account.id], '/path/to/video.mp4', { title: 'Test' });

      const batches = orchestrator.getBatches();
      const batch = orchestrator.getBatch(batches[0].id);

      expect(batch).toBeDefined();
      expect(batch?.id).toBe(batches[0].id);
    });

    test('gets batch statistics', async () => {
      const accountManager = new AccountManager();
      const account1 = accountManager.addAccount('A1', 'youtube', '@a1', {});
      const account2 = accountManager.addAccount('A2', 'tiktok', '@a2', {});

      const orchestrator = new PostingOrchestrator(accountManager);
      orchestrator.registerAdapter('youtube', new MockAdapter('youtube'));
      orchestrator.registerAdapter('tiktok', new MockAdapter('tiktok'));

      await orchestrator.uploadToAccounts([account1.id, account2.id], '/path/to/video.mp4', { title: 'Test' });

      const batches = orchestrator.getBatches();
      const stats = orchestrator.getBatchStats(batches[0].id);

      expect(stats).toBeDefined();
      expect(stats?.total).toBe(2);
      expect(stats?.successful).toBe(2);
      expect(stats?.failed).toBe(0);
      expect(stats?.success_rate).toBe(100);
    });

    test('schedules post', async () => {
      const accountManager = new AccountManager();
      const account = accountManager.addAccount('Test', 'youtube', '@test', {});

      const orchestrator = new PostingOrchestrator(accountManager);
      orchestrator.registerAdapter('youtube', new MockAdapter('youtube'));

      const success = await orchestrator.schedulePost('post-123', account.id, '2026-05-20T14:00:00Z');

      expect(success).toBe(true);
    });

    test('deletes post', async () => {
      const accountManager = new AccountManager();
      const account = accountManager.addAccount('Test', 'youtube', '@test', {});

      const orchestrator = new PostingOrchestrator(accountManager);
      orchestrator.registerAdapter('youtube', new MockAdapter('youtube'));

      const success = await orchestrator.deletePost('post-123', account.id);

      expect(success).toBe(true);
    });

    test('gets post statistics', async () => {
      const accountManager = new AccountManager();
      const account = accountManager.addAccount('Test', 'youtube', '@test', {});

      const orchestrator = new PostingOrchestrator(accountManager);
      orchestrator.registerAdapter('youtube', new MockAdapter('youtube'));

      const stats = await orchestrator.getPostStats('post-123', account.id);

      expect(stats).toBeDefined();
      expect(stats?.views).toBe(1000);
      expect(stats?.likes).toBe(100);
    });
  });
});
