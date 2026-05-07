import { YouTubeAdapter } from '../../src/posting/adapters/youtube';

describe('YouTubeAdapter', () => {
  let adapter: YouTubeAdapter;

  beforeEach(() => {
    adapter = new YouTubeAdapter('client-id', 'client-secret', 'http://localhost:3000/oauth/callback');
  });

  describe('initialization', () => {
    it('should create adapter with credentials', () => {
      expect(adapter).toBeDefined();
    });

    it('should set tokens', () => {
      adapter.setTokens('access-token', 'refresh-token');
      expect(adapter).toBeDefined();
    });
  });

  describe('auth URL', () => {
    it('should generate valid OAuth URL', () => {
      const url = adapter.getAuthUrl();
      expect(url).toContain('accounts.google.com');
      expect(url).toContain('client_id=client-id');
      expect(url).toContain('youtube.upload');
    });
  });

  describe('upload', () => {
    it('should fail without access token', async () => {
      const options = {
        account_id: 'test-account',
        video_path: '/path/to/video.mp4',
        metadata: {
          title: 'Test Video',
          description: 'Test',
        },
      };

      await expect(adapter.upload(options)).rejects.toThrow('No access token');
    });

    it('should return post result with token', async () => {
      adapter.setTokens('access-token', 'refresh-token');

      const options = {
        account_id: 'test-account',
        video_path: '/path/to/video.mp4',
        metadata: {
          title: 'Test Video',
          description: 'Test',
        },
      };

      const result = await adapter.upload(options);

      expect(result.platform).toBe('youtube');
      expect(result.post_id).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe('pending');
    });
  });

  describe('schedule', () => {
    it('should fail without access token', async () => {
      await expect(adapter.schedule('post-id', new Date().toISOString())).rejects.toThrow('No access token');
    });

    it('should schedule with token', async () => {
      adapter.setTokens('access-token', 'refresh-token');

      const result = await adapter.schedule('post-id', new Date().toISOString());
      expect(result).toBe(true);
    });
  });

  describe('post stats', () => {
    it('should fail without access token', async () => {
      await expect(adapter.getPostStats('post-id')).rejects.toThrow('No access token');
    });

    it('should return stats with token', async () => {
      adapter.setTokens('access-token', 'refresh-token');

      const stats = await adapter.getPostStats('post-id');

      expect(stats.status).toBe('published');
      expect(stats.views).toBeDefined();
    });
  });

  describe('token refresh', () => {
    it('should fail without refresh token', async () => {
      await expect(adapter.refreshAccessToken()).rejects.toThrow('No refresh token');
    });

    it('should fail when implemented (stub)', async () => {
      adapter.setTokens('access-token', 'refresh-token');

      await expect(adapter.refreshAccessToken()).rejects.toThrow('not implemented');
    });
  });
});
