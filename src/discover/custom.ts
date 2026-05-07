import { Topic } from '../types';
import { DiscoverSource } from './types';

export class CustomSource implements DiscoverSource {
  private topics: Topic[] = [];

  constructor(initialTopics?: Topic[]) {
    this.topics = initialTopics || [];
  }

  async discover(_keywords?: string[]): Promise<Topic[]> {
    return this.topics;
  }

  addTopic(topic: Topic): void {
    this.topics.push(topic);
  }

  addTopics(topics: Topic[]): void {
    this.topics.push(...topics);
  }

  clear(): void {
    this.topics = [];
  }

  getAll(): Topic[] {
    return this.topics;
  }
}
