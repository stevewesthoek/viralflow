import { Account, Series, AccountRegistry, Platform, PlatformCredentials } from './types';
import { generateId, getCurrentTimestamp } from '../utils';

/**
 * Account registry and management
 */

export class AccountManager {
  private registry: AccountRegistry;

  constructor(registry?: AccountRegistry) {
    this.registry = registry || this.createEmptyRegistry();
  }

  /**
   * Create empty registry
   */
  private createEmptyRegistry(): AccountRegistry {
    return {
      accounts: [],
      series: [],
      platform_strategies: {
        youtube: {
          platform: 'youtube',
          format: 'longform',
          aspect_ratio: '16:9',
          max_duration: 3600,
          upload_frequency: 3,
          optimal_posting_time: '14:00',
        },
        tiktok: {
          platform: 'tiktok',
          format: 'shortform',
          aspect_ratio: '9:16',
          max_duration: 60,
          upload_frequency: 7,
          optimal_posting_time: '19:00',
        },
        instagram: {
          platform: 'instagram',
          format: 'shortform',
          aspect_ratio: '9:16',
          max_duration: 90,
          upload_frequency: 5,
          optimal_posting_time: '17:00',
        },
        linkedin: {
          platform: 'linkedin',
          format: 'longform',
          aspect_ratio: '1:1',
          max_duration: 120,
          upload_frequency: 3,
          optimal_posting_time: '09:00',
        },
        facebook: {
          platform: 'facebook',
          format: 'mixed',
          aspect_ratio: '16:9',
          max_duration: 600,
          upload_frequency: 4,
          optimal_posting_time: '18:00',
        },
        bluesky: {
          platform: 'bluesky',
          format: 'mixed',
          aspect_ratio: '1:1',
          max_duration: 60,
          upload_frequency: 10,
          optimal_posting_time: '12:00',
        },
        x: {
          platform: 'x',
          format: 'shortform',
          aspect_ratio: '16:9',
          max_duration: 60,
          upload_frequency: 15,
          optimal_posting_time: '11:00',
        },
        custom: {
          platform: 'custom',
          format: 'mixed',
          aspect_ratio: '16:9',
          max_duration: 600,
          upload_frequency: 3,
          optimal_posting_time: '14:00',
        },
      },
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };
  }

  /**
   * Add a new account
   */
  addAccount(
    name: string,
    platform: Platform,
    handle: string,
    credentials: PlatformCredentials
  ): Account {
    const account: Account = {
      id: generateId('account'),
      name,
      platform,
      handle,
      credentials,
      created_at: getCurrentTimestamp(),
      last_used: getCurrentTimestamp(),
      is_active: true,
    };

    this.registry.accounts.push(account);
    this.registry.updated_at = getCurrentTimestamp();

    if (!this.registry.default_account) {
      this.registry.default_account = account.id;
    }

    return account;
  }

  /**
   * Get account by ID
   */
  getAccount(accountId: string): Account | null {
    return this.registry.accounts.find((a) => a.id === accountId) || null;
  }

  /**
   * Get all accounts for a platform
   */
  getAccountsByPlatform(platform: Platform): Account[] {
    return this.registry.accounts.filter((a) => a.platform === platform && a.is_active);
  }

  /**
   * Update account credentials
   */
  updateCredentials(accountId: string, credentials: PlatformCredentials): boolean {
    const account = this.getAccount(accountId);
    if (!account) return false;

    account.credentials = { ...account.credentials, ...credentials };
    account.last_used = getCurrentTimestamp();
    this.registry.updated_at = getCurrentTimestamp();
    return true;
  }

  /**
   * Deactivate account
   */
  deactivateAccount(accountId: string): boolean {
    const account = this.getAccount(accountId);
    if (!account) return false;

    account.is_active = false;
    this.registry.updated_at = getCurrentTimestamp();
    return true;
  }

  /**
   * Create a new series
   */
  createSeries(
    name: string,
    description: string,
    accountIds: string[]
  ): Series {
    const series: Series = {
      id: generateId('series'),
      name,
      description,
      account_ids: accountIds,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    this.registry.series.push(series);
    this.registry.updated_at = getCurrentTimestamp();

    return series;
  }

  /**
   * Get series by ID
   */
  getSeries(seriesId: string): Series | null {
    return this.registry.series.find((s) => s.id === seriesId) || null;
  }

  /**
   * Get all series
   */
  getAllSeries(): Series[] {
    return this.registry.series;
  }

  /**
   * Add account to series
   */
  addAccountToSeries(seriesId: string, accountId: string): boolean {
    const series = this.getSeries(seriesId);
    if (!series) return false;

    if (!series.account_ids.includes(accountId)) {
      series.account_ids.push(accountId);
      series.updated_at = getCurrentTimestamp();
      this.registry.updated_at = getCurrentTimestamp();
    }

    return true;
  }

  /**
   * Remove account from series
   */
  removeAccountFromSeries(seriesId: string, accountId: string): boolean {
    const series = this.getSeries(seriesId);
    if (!series) return false;

    series.account_ids = series.account_ids.filter((id) => id !== accountId);
    series.updated_at = getCurrentTimestamp();
    this.registry.updated_at = getCurrentTimestamp();

    return true;
  }

  /**
   * Get strategy for platform
   */
  getPlatformStrategy(platform: Platform) {
    return this.registry.platform_strategies[platform];
  }

  /**
   * Update platform strategy
   */
  updatePlatformStrategy(platform: Platform, updates: Partial<typeof this.registry.platform_strategies[Platform]>) {
    const strategy = this.registry.platform_strategies[platform];
    if (!strategy) return false;

    Object.assign(strategy, updates);
    this.registry.updated_at = getCurrentTimestamp();
    return true;
  }

  /**
   * Get registry
   */
  getRegistry(): AccountRegistry {
    return this.registry;
  }

  /**
   * Set registry
   */
  setRegistry(registry: AccountRegistry): void {
    this.registry = registry;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      total_accounts: this.registry.accounts.length,
      active_accounts: this.registry.accounts.filter((a) => a.is_active).length,
      total_series: this.registry.series.length,
      accounts_by_platform: this.registry.accounts.reduce(
        (acc, a) => {
          acc[a.platform] = (acc[a.platform] || 0) + 1;
          return acc;
        },
        {} as Record<Platform, number>
      ),
    };
  }
}

export { Account, Series, AccountRegistry, Platform, PlatformCredentials };
