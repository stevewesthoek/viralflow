import { spawn } from 'child_process';
import { resolve } from 'path';

describe('CLI Commands', () => {
  const cliPath = resolve(__dirname, '../dist/cli.js');

  function runCli(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
    return new Promise((resolve) => {
      const proc = spawn('node', [cliPath, ...args], {
        cwd: __dirname,
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        resolve({ stdout, stderr, code: code || 0 });
      });
    });
  }

  describe('help', () => {
    it('should show help when called with --help', async () => {
      const result = await runCli(['--help']);
      expect(result.stdout).toContain('Viral Flow v0.4.0');
      expect(result.stdout).toContain('COMMANDS:');
      expect(result.stdout).toContain('discover');
    });

    it('should show help when called with -h', async () => {
      const result = await runCli(['-h']);
      expect(result.stdout).toContain('Viral Flow v0.4.0');
    });

    it('should show help when called with no arguments', async () => {
      const result = await runCli([]);
      expect(result.stdout).toContain('Viral Flow v0.4.0');
    });
  });

  describe('discover', () => {
    it('should discover topics with keywords', async () => {
      const result = await runCli(['discover', '--keywords', 'AI']);
      expect(result.stdout).toContain('✅');
      expect(result.stdout).toContain('trending topics');
    });

    it('should support --json output', async () => {
      const result = await runCli(['discover', '--keywords', 'AI', '--json']);
      expect(() => JSON.parse(result.stdout)).not.toThrow();
      const data = JSON.parse(result.stdout);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should honor --limit parameter', async () => {
      const result = await runCli(['discover', '--keywords', 'AI', '--limit', '3', '--json']);
      const data = JSON.parse(result.stdout);
      expect(data.length).toBeLessThanOrEqual(3);
    });
  });

  describe('angles', () => {
    it('should generate angles for a topic', async () => {
      const result = await runCli(['angles', 'AI Trends']);
      expect(result.stdout).toContain('✅');
      expect(result.stdout).toContain('angles');
    });

    it('should support --json output', async () => {
      const result = await runCli(['angles', 'AI Trends', '--json']);
      expect(() => JSON.parse(result.stdout)).not.toThrow();
      const data = JSON.parse(result.stdout);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should support --count parameter', async () => {
      const result = await runCli(['angles', 'AI Trends', '--count', '5', '--json']);
      const data = JSON.parse(result.stdout);
      expect(data.length).toBeLessThanOrEqual(5);
    });
  });

  describe('hooks', () => {
    it('should generate hooks for a topic', async () => {
      const result = await runCli(['hooks', 'AI Trends']);
      expect(result.stdout).toContain('✅');
      expect(result.stdout).toContain('hooks');
    });

    it('should support --json output', async () => {
      const result = await runCli(['hooks', 'AI Trends', '--json']);
      expect(() => JSON.parse(result.stdout)).not.toThrow();
      const data = JSON.parse(result.stdout);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should support --angle parameter', async () => {
      const result = await runCli(['hooks', 'AI Trends', '--angle', 'Contrarian take', '--json']);
      const data = JSON.parse(result.stdout);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('script', () => {
    it('should build a script for a topic', async () => {
      const result = await runCli(['script', 'AI Trends']);
      expect(result.stdout).toContain('✅');
      expect(result.stdout).toContain('script');
    });

    it('should support --json output', async () => {
      const result = await runCli(['script', 'AI Trends', '--json']);
      expect(() => JSON.parse(result.stdout)).not.toThrow();
      const data = JSON.parse(result.stdout);
      expect(data.content).toBeDefined();
    });

    it('should support --format parameter', async () => {
      const result = await runCli(['script', 'AI Trends', '--format', 'shortform', '--json']);
      const data = JSON.parse(result.stdout);
      expect(data.format).toBe('shortform');
    });
  });

  describe('analyze', () => {
    it('should analyze performance', async () => {
      const result = await runCli(['analyze']);
      expect(result.stdout).toContain('✅');
      expect(result.stdout).toContain('Performance Analysis');
    });

    it('should support --json output', async () => {
      const result = await runCli(['analyze', '--json']);
      expect(() => JSON.parse(result.stdout)).not.toThrow();
      const data = JSON.parse(result.stdout);
      expect(data.patterns).toBeDefined();
    });

    it('should support --channel parameter', async () => {
      const result = await runCli(['analyze', '--channel', 'my-channel', '--json']);
      const data = JSON.parse(result.stdout);
      expect(data.channel).toBe('my-channel');
    });
  });

  describe('accounts', () => {
    it('should list accounts', async () => {
      const result = await runCli(['accounts', 'list']);
      expect(result.stdout).toContain('Configured Accounts');
    });

    it('should support --json output for list', async () => {
      const result = await runCli(['accounts', 'list', '--json']);
      expect(() => JSON.parse(result.stdout)).not.toThrow();
    });

    it('should add an account', async () => {
      const result = await runCli(['accounts', 'add', '--platform', 'youtube', '--name', 'Test Channel']);
      expect(result.stdout).toContain('Added account');
    });

    it('should support --json output for add', async () => {
      const result = await runCli(['accounts', 'add', '--platform', 'tiktok', '--name', 'Test', '--json']);
      expect(() => JSON.parse(result.stdout)).not.toThrow();
      const data = JSON.parse(result.stdout);
      expect(data.status).toBe('added');
    });
  });

  describe('error handling', () => {
    it('should handle unknown command', async () => {
      const result = await runCli(['unknown']);
      expect(result.stderr).toContain('Error');
      expect(result.code).toBe(1);
    });

    it('should require topic for angles command', async () => {
      const result = await runCli(['angles']);
      expect(result.stderr).toContain('Error');
    });

    it('should require topic for hooks command', async () => {
      const result = await runCli(['hooks']);
      expect(result.stderr).toContain('Error');
    });
  });
});
