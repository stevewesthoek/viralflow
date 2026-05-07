import { AccountManager } from '../src/accounts';
import { Platform } from '../src/accounts/types';

describe('Account Management', () => {
  describe('AccountManager', () => {
    test('creates new account manager', () => {
      const manager = new AccountManager();
      const stats = manager.getStats();

      expect(stats.total_accounts).toBe(0);
      expect(stats.total_series).toBe(0);
    });

    test('adds a new account', () => {
      const manager = new AccountManager();

      const account = manager.addAccount('Main YouTube', 'youtube', '@myhandle', {
        api_key: 'test-key',
        channel_id: 'UC123456',
      });

      expect(account).toBeDefined();
      expect(account.name).toBe('Main YouTube');
      expect(account.platform).toBe('youtube');
      expect(account.is_active).toBe(true);
    });

    test('gets account by ID', () => {
      const manager = new AccountManager();
      const account = manager.addAccount('Test Account', 'tiktok', '@test', {});

      const retrieved = manager.getAccount(account.id);
      expect(retrieved).toEqual(account);
    });

    test('returns null for non-existent account', () => {
      const manager = new AccountManager();
      const retrieved = manager.getAccount('nonexistent');

      expect(retrieved).toBeNull();
    });

    test('gets accounts by platform', () => {
      const manager = new AccountManager();

      manager.addAccount('YouTube 1', 'youtube', '@yt1', {});
      manager.addAccount('YouTube 2', 'youtube', '@yt2', {});
      manager.addAccount('TikTok 1', 'tiktok', '@tk1', {});

      const youtube = manager.getAccountsByPlatform('youtube' as Platform);
      expect(youtube).toHaveLength(2);

      const tiktok = manager.getAccountsByPlatform('tiktok' as Platform);
      expect(tiktok).toHaveLength(1);
    });

    test('updates account credentials', () => {
      const manager = new AccountManager();
      const account = manager.addAccount('Test', 'youtube', '@test', { api_key: 'old' });

      const success = manager.updateCredentials(account.id, { api_key: 'new' });
      expect(success).toBe(true);

      const updated = manager.getAccount(account.id);
      expect(updated?.credentials.api_key).toBe('new');
    });

    test('returns false when updating non-existent account', () => {
      const manager = new AccountManager();
      const success = manager.updateCredentials('nonexistent', { api_key: 'test' });

      expect(success).toBe(false);
    });

    test('deactivates account', () => {
      const manager = new AccountManager();
      const account = manager.addAccount('Test', 'youtube', '@test', {});

      const success = manager.deactivateAccount(account.id);
      expect(success).toBe(true);

      const updated = manager.getAccount(account.id);
      expect(updated?.is_active).toBe(false);
    });

    test('only returns active accounts by platform', () => {
      const manager = new AccountManager();

      const active = manager.addAccount('Active', 'youtube', '@active', {});
      const inactive = manager.addAccount('Inactive', 'youtube', '@inactive', {});

      manager.deactivateAccount(inactive.id);

      const youtube = manager.getAccountsByPlatform('youtube' as Platform);
      expect(youtube).toHaveLength(1);
      expect(youtube[0].id).toBe(active.id);
    });
  });

  describe('Series Management', () => {
    test('creates a new series', () => {
      const manager = new AccountManager();
      const account = manager.addAccount('Account 1', 'youtube', '@a1', {});

      const series = manager.createSeries('My Series', 'Series description', [account.id]);

      expect(series).toBeDefined();
      expect(series.name).toBe('My Series');
      expect(series.account_ids).toContain(account.id);
    });

    test('gets series by ID', () => {
      const manager = new AccountManager();
      const account = manager.addAccount('Account', 'youtube', '@a', {});
      const created = manager.createSeries('Test Series', 'Desc', [account.id]);

      const retrieved = manager.getSeries(created.id);
      expect(retrieved).toEqual(created);
    });

    test('gets all series', () => {
      const manager = new AccountManager();
      const account = manager.addAccount('Account', 'youtube', '@a', {});

      manager.createSeries('Series 1', 'Desc 1', [account.id]);
      manager.createSeries('Series 2', 'Desc 2', [account.id]);

      const all = manager.getAllSeries();
      expect(all).toHaveLength(2);
    });

    test('adds account to series', () => {
      const manager = new AccountManager();
      const account1 = manager.addAccount('A1', 'youtube', '@a1', {});
      const account2 = manager.addAccount('A2', 'tiktok', '@a2', {});

      const series = manager.createSeries('Series', 'Desc', [account1.id]);
      expect(series.account_ids).toHaveLength(1);

      const success = manager.addAccountToSeries(series.id, account2.id);
      expect(success).toBe(true);

      const updated = manager.getSeries(series.id);
      expect(updated?.account_ids).toHaveLength(2);
    });

    test('removes account from series', () => {
      const manager = new AccountManager();
      const account = manager.addAccount('Account', 'youtube', '@a', {});

      const series = manager.createSeries('Series', 'Desc', [account.id]);
      const success = manager.removeAccountFromSeries(series.id, account.id);

      expect(success).toBe(true);

      const updated = manager.getSeries(series.id);
      expect(updated?.account_ids).toHaveLength(0);
    });
  });

  describe('Platform Strategies', () => {
    test('gets platform strategy', () => {
      const manager = new AccountManager();
      const strategy = manager.getPlatformStrategy('youtube' as Platform);

      expect(strategy).toBeDefined();
      expect(strategy?.platform).toBe('youtube');
      expect(strategy?.format).toBe('longform');
      expect(strategy?.aspect_ratio).toBe('16:9');
    });

    test('all platforms have default strategies', () => {
      const manager = new AccountManager();
      const platforms: Platform[] = ['youtube', 'tiktok', 'instagram', 'linkedin', 'facebook', 'bluesky', 'x', 'custom'];

      platforms.forEach((platform) => {
        const strategy = manager.getPlatformStrategy(platform);
        expect(strategy).toBeDefined();
        expect(strategy?.max_duration).toBeGreaterThan(0);
      });
    });

    test('updates platform strategy', () => {
      const manager = new AccountManager();

      const success = manager.updatePlatformStrategy('youtube' as Platform, {
        upload_frequency: 5,
        optimal_posting_time: '15:00',
      });

      expect(success).toBe(true);

      const updated = manager.getPlatformStrategy('youtube' as Platform);
      expect(updated?.upload_frequency).toBe(5);
      expect(updated?.optimal_posting_time).toBe('15:00');
    });
  });

  describe('Registry Management', () => {
    test('gets full registry', () => {
      const manager = new AccountManager();
      manager.addAccount('Account', 'youtube', '@a', {});

      const registry = manager.getRegistry();

      expect(registry.accounts).toHaveLength(1);
      expect(registry.platform_strategies).toBeDefined();
      expect(Object.keys(registry.platform_strategies).length).toBeGreaterThan(0);
    });

    test('sets registry', () => {
      const manager1 = new AccountManager();
      manager1.addAccount('Account 1', 'youtube', '@a1', {});

      const registry = manager1.getRegistry();

      const manager2 = new AccountManager();
      manager2.setRegistry(registry);

      expect(manager2.getRegistry().accounts).toHaveLength(1);
    });

    test('gets statistics', () => {
      const manager = new AccountManager();

      manager.addAccount('YT 1', 'youtube', '@yt1', {});
      manager.addAccount('YT 2', 'youtube', '@yt2', {});
      manager.addAccount('TK', 'tiktok', '@tk', {});

      const stats = manager.getStats();

      expect(stats.total_accounts).toBe(3);
      expect(stats.active_accounts).toBe(3);
      expect(stats.accounts_by_platform.youtube).toBe(2);
      expect(stats.accounts_by_platform.tiktok).toBe(1);
    });

    test('deactivated accounts not counted as active', () => {
      const manager = new AccountManager();

      const account = manager.addAccount('Account', 'youtube', '@a', {});
      manager.deactivateAccount(account.id);

      const stats = manager.getStats();

      expect(stats.total_accounts).toBe(1);
      expect(stats.active_accounts).toBe(0);
    });
  });
});
