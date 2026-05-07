#!/usr/bin/env node

import { discover } from './discover';
import { generateAngles } from './angle';
import { generateHooks } from './hook';
import { buildScript } from './script';
import { analyzePatterns } from './analyze';
import { AccountManager } from './accounts';

interface CLIContext {
  outputJson: boolean;
  command: string;
  args: string[];
}

function parseArgs(): CLIContext {
  const args = process.argv.slice(2);
  const outputJson = args.includes('--json');
  const filteredArgs = args.filter((arg) => arg !== '--json');

  return {
    outputJson,
    command: filteredArgs[0] || '',
    args: filteredArgs.slice(1),
  };
}

function getArgValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index >= 0 && index < args.length - 1 ? args[index + 1] : undefined;
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const match = args.find((arg) => arg.startsWith(flag + '='));
  return match ? match.split('=')[1] : getArgValue(args, flag);
}

function log(message: string, json: boolean = false): void {
  if (!json) {
    console.log(message);
  }
}

function logJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

function logError(message: string): void {
  console.error(`❌ Error: ${message}`);
  process.exit(1);
}

function showHelp(): void {
  console.log(`
Viral Flow v0.4.0 — Content Strategy Engine

USAGE:
  viral-flow <command> [options]

COMMANDS:

  discover [--keywords "..."] [--icp "..."] [--limit 5] [--json]
    Find trending topics across multiple sources

    Options:
      --keywords  Comma-separated keywords to search
      --icp       Target audience description (ICP filter)
      --limit     Max topics to return (default: 5)
      --json      Output JSON format

  angles <topic> [--format youtube,tiktok] [--count 15] [--json]
    Generate 15 unique angles using Contrast Formula

    Options:
      --format    Target formats (youtube, tiktok, linkedin)
      --count     Number of angles to generate (default: 15)
      --json      Output JSON format

  hooks <topic> [--angle "..."] [--count 3] [--json]
    Score and rank hooks using research-backed patterns

    Options:
      --angle     Specific angle text to use
      --count     Number of hooks to return (default: 3)
      --json      Output JSON format

  script <topic> [--angle "..."] [--hook "..."] [--format longform] [--json]
    Build production-ready script

    Options:
      --angle     Angle text or ID
      --hook      Hook text or ID
      --format    Video format (longform, shortform, linkedin)
      --json      Output JSON format

  analyze [--channel <id>] [--days 30] [--json]
    Analyze performance patterns and get recommendations

    Options:
      --channel   Channel ID to analyze
      --days      Days of history to analyze (default: 30)
      --json      Output JSON format

  post <video-path> --platform youtube|tiktok [--title "..."] [--schedule "..."] [--json]
    Upload video to platform(s)

    Options:
      --platform  Target platform (youtube, tiktok, instagram, linkedin)
      --title     Video title
      --schedule  ISO date to schedule (optional)
      --json      Output JSON format

  accounts list [--json]
    List all configured accounts

  accounts add --platform <name> --name "..." [--json]
    Add a new platform account

    Options:
      --platform  Platform name (youtube, tiktok, instagram, etc.)
      --name      Account display name
      --json      Output JSON format

  --help, -h
    Show this help message

EXAMPLES:

  viral-flow discover --keywords "AI automation" --icp "B2B founders"
  viral-flow angles "AI Automation Trends" --format youtube,tiktok
  viral-flow hooks "AI Trends" --angle "Contrarian take on AI"
  viral-flow script "AI Trends" --format longform
  viral-flow analyze --channel my-channel --days 30 --json
  viral-flow post ./video.mp4 --platform youtube --title "My Video"
  viral-flow accounts list

For more help, see: https://github.com/stevewesthoek/viralflow
  `);
}

async function cmdDiscover(args: string[], outputJson: boolean): Promise<void> {
  try {
    const keywords = getFlagValue(args, '--keywords')?.split(',') || [];
    const icpFilter = getFlagValue(args, '--icp');
    const limitStr = getFlagValue(args, '--limit') || '5';
    const limit = parseInt(limitStr, 10);

    log('🔍 Discovering trending topics...', outputJson);

    const topics = await discover({
      sources: ['youtube', 'reddit'],
      keywords,
      icp_filter: icpFilter,
      max_results: limit,
    });

    if (outputJson) {
      logJson(topics);
    } else {
      log(`\n✅ Found ${topics.length} trending topics:\n`);
      topics.forEach((topic, index) => {
        log(`${index + 1}. "${topic.title}"`);
        log(`   Trend: ${topic.trend_score}/100 | Competition: ${topic.competition_score}/100`);
        log(`   Keywords: ${topic.keywords.join(', ')}`);
        log('');
      });
    }
  } catch (error) {
    logError(`Failed to discover topics: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function cmdAngles(args: string[], outputJson: boolean): Promise<void> {
  try {
    const topic = args[0];
    if (!topic) {
      logError('Topic is required. Usage: viral-flow angles "<topic>" [--format youtube,tiktok] [--count 15]');
    }

    const formatStr = getFlagValue(args, '--format') || 'longform,shortform,linkedin';
    const formats = formatStr.split(',') as ('longform' | 'shortform' | 'linkedin')[];
    const countStr = getFlagValue(args, '--count') || '15';
    const count = parseInt(countStr, 10);

    log('💡 Generating angles...', outputJson);

    // For CLI, create a minimal topic object
    const mockTopic = {
      id: 'cli-topic',
      title: topic,
      keywords: topic.split(' '),
      description: topic,
      source: 'cli',
      trend_score: 80,
      competition_score: 50,
      relevance_score: 75,
      created_at: new Date().toISOString(),
      metadata: {},
    };

    const angles = generateAngles({ topic: mockTopic, formats, num_angles: count });

    if (outputJson) {
      logJson(angles);
    } else {
      log(`\n✅ Generated ${angles.length} angles:\n`);
      angles.forEach((angle, index) => {
        log(`${index + 1}. [${angle.format.toUpperCase()}] ${angle.angle_text}`);
        log(`   Contrast: "${angle.contrast_pair.old}" → "${angle.contrast_pair.new}"`);
        log('');
      });
    }
  } catch (error) {
    logError(`Failed to generate angles: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function cmdHooks(args: string[], outputJson: boolean): Promise<void> {
  try {
    const topic = args[0];
    if (!topic) {
      logError('Topic is required. Usage: viral-flow hooks "<topic>" [--angle "..."] [--count 3]');
    }

    const angle = getFlagValue(args, '--angle') || 'Default angle';
    const countStr = getFlagValue(args, '--count') || '3';
    const count = parseInt(countStr, 10);

    log('🎣 Scoring hooks...', outputJson);

    // Create mock objects for CLI
    const mockTopic = {
      id: 'cli-topic',
      title: topic,
      keywords: topic.split(' '),
      description: topic,
      source: 'cli',
      trend_score: 80,
      competition_score: 50,
      relevance_score: 75,
      created_at: new Date().toISOString(),
      metadata: {},
    };

    const mockAngle = {
      id: 'cli-angle',
      topic_id: 'cli-topic',
      angle_text: angle,
      format: 'longform' as const,
      contrast_pair: { old: 'assumption', new: angle },
      target_emotion: 'curiosity' as const,
      created_at: new Date().toISOString(),
    };

    const hooks = generateHooks({ topic: mockTopic, angle: mockAngle, num_hooks: count });

    if (outputJson) {
      logJson(hooks);
    } else {
      log(`\n✅ Top ${hooks.length} hooks:\n`);
      hooks.forEach((hook, index) => {
        log(`${index + 1}. [${hook.pattern}] ${hook.text}`);
        log(`   Score: ${hook.score.toFixed(1)}/100`);
        log('');
      });
    }
  } catch (error) {
    logError(`Failed to generate hooks: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function cmdScript(args: string[], outputJson: boolean): Promise<void> {
  try {
    const topic = args[0];
    if (!topic) {
      logError('Topic is required. Usage: viral-flow script "<topic>" [--angle "..."] [--hook "..."] [--format longform]');
    }

    const angle = getFlagValue(args, '--angle') || 'Default angle';
    const hook = getFlagValue(args, '--hook') || 'Compelling hook';
    const format = (getFlagValue(args, '--format') || 'longform') as 'longform' | 'shortform' | 'linkedin';

    log('📝 Building script...', outputJson);

    const mockTopic = {
      id: 'cli-topic',
      title: topic,
      keywords: topic.split(' '),
      description: topic,
      source: 'cli',
      trend_score: 80,
      competition_score: 50,
      relevance_score: 75,
      created_at: new Date().toISOString(),
      metadata: {},
    };

    const mockAngle = {
      id: 'cli-angle',
      topic_id: 'cli-topic',
      angle_text: angle,
      format,
      contrast_pair: { old: 'old way', new: angle },
      target_emotion: 'curiosity' as const,
      created_at: new Date().toISOString(),
    };

    const mockHook = {
      id: 'cli-hook',
      text: hook,
      pattern: 'curiosity_gap' as const,
      score: 85,
      created_at: new Date().toISOString(),
    };

    const script = buildScript({ topic: mockTopic, angle: mockAngle, hook: mockHook, format });

    if (outputJson) {
      logJson(script);
    } else {
      log(`\n✅ Production-ready script:\n`);
      log(`Title: ${script.title}`);
      log(`Duration: ~${script.estimated_duration} min (${format})`);
      log(`\n${script.content}\n`);
    }
  } catch (error) {
    logError(`Failed to build script: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function cmdAnalyze(args: string[], outputJson: boolean): Promise<void> {
  try {
    const channel = getFlagValue(args, '--channel');
    const daysStr = getFlagValue(args, '--days') || '30';
    const days = parseInt(daysStr, 10);

    log('📊 Analyzing performance...', outputJson);

    // For CLI, create a minimal brain
    const brain = {
      icp: 'General audience',
      pillar_topics: [],
      learned_patterns: {
        best_hook_patterns: [],
        best_angles: [],
        best_platforms: [],
        audience_preferences: {},
      },
      performance_history: [],
      last_updated: new Date().toISOString(),
    };

    const patterns = analyzePatterns(brain);

    if (outputJson) {
      logJson({ channel, days, patterns });
    } else {
      log(`\n✅ Performance Analysis (last ${days} days):\n`);
      log(`Best platforms: ${patterns.best_platforms.join(', ') || 'None tracked yet'}`);
      log(`Best hook patterns: ${patterns.best_hook_patterns.join(', ') || 'None tracked yet'}`);
      log(`Average engagement: ${(patterns.audience_insights?.avg_engagement_rate as number) || 0}`);
      log('');
    }
  } catch (error) {
    logError(`Failed to analyze: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function cmdPost(_args: string[], outputJson: boolean): Promise<void> {
  try {
    log('📤 Post command under development', outputJson);
    if (outputJson) {
      logJson({ status: 'not_implemented', message: 'Posting requires platform adapters (YouTube, TikTok, etc.)' });
    }
  } catch (error) {
    logError(`Failed to post: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function cmdAccounts(args: string[], outputJson: boolean): Promise<void> {
  try {
    const subcommand = args[0];
    const manager = new AccountManager();

    if (subcommand === 'list') {
      // Get all accounts by platform
      const platforms: string[] = ['youtube', 'tiktok', 'instagram', 'linkedin', 'facebook'];
      const allAccounts: unknown[] = [];

      platforms.forEach((p) => {
        const platformAccounts = manager.getAccountsByPlatform(p as 'youtube' | 'tiktok' | 'instagram' | 'linkedin' | 'facebook');
        allAccounts.push(...platformAccounts);
      });

      if (outputJson) {
        logJson(allAccounts);
      } else {
        log(`\n✅ Configured Accounts:\n`);
        if (allAccounts.length === 0) {
          log('No accounts configured. Use: viral-flow accounts add --platform <name> --name "..."');
        } else {
          allAccounts.forEach((account: unknown, index: number) => {
            const acc = account as { account_name: string; platform: string };
            log(`${index + 1}. ${acc.account_name} (${acc.platform})`);
          });
        }
        log('');
      }
    } else if (subcommand === 'add') {
      const platform = getFlagValue(args, '--platform');
      const name = getFlagValue(args, '--name');

      if (!platform || !name) {
        logError('Usage: viral-flow accounts add --platform <name> --name "..." [--handle "..."]');
      }

      const handle = getFlagValue(args, '--handle') || name || '';
      manager.addAccount(name || '', platform as 'youtube' | 'tiktok' | 'instagram' | 'linkedin' | 'facebook', handle, {});

      if (outputJson) {
        logJson({ status: 'added', platform, account_name: name });
      } else {
        log(`\n✅ Added account: ${name} (${platform})\n`);
      }
    } else {
      logError(`Unknown subcommand: ${subcommand}. Use: viral-flow accounts list | add`);
    }
  } catch (error) {
    logError(`Failed to manage accounts: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function main(): Promise<void> {
  const ctx = parseArgs();

  if (!ctx.command || ctx.command === '--help' || ctx.command === '-h') {
    showHelp();
    process.exit(0);
  }

  try {
    switch (ctx.command) {
      case 'discover':
        await cmdDiscover(ctx.args, ctx.outputJson);
        break;
      case 'angles':
        await cmdAngles(ctx.args, ctx.outputJson);
        break;
      case 'hooks':
        await cmdHooks(ctx.args, ctx.outputJson);
        break;
      case 'script':
        await cmdScript(ctx.args, ctx.outputJson);
        break;
      case 'analyze':
        await cmdAnalyze(ctx.args, ctx.outputJson);
        break;
      case 'post':
        await cmdPost(ctx.args, ctx.outputJson);
        break;
      case 'accounts':
        await cmdAccounts(ctx.args, ctx.outputJson);
        break;
      default:
        logError(`Unknown command: ${ctx.command}. Run: viral-flow --help`);
    }
  } catch (error) {
    logError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

main();
