import { Topic } from '../types';

export interface DiscoverSource {
  discover(keywords: string[]): Promise<Topic[]>;
}

export interface DiscoverResult {
  topics: Topic[];
  total: number;
  source: string;
}
