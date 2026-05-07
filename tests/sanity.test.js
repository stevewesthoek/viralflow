"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ViralFlow = __importStar(require("../src/index"));
const Types = __importStar(require("../src/types"));
const Utils = __importStar(require("../src/utils"));
describe('Package Loading', () => {
    test('main export is defined', () => {
        expect(ViralFlow).toBeDefined();
    });
    test('types are exported', () => {
        expect(Types).toBeDefined();
    });
    test('utils are exported', () => {
        expect(Utils).toBeDefined();
    });
});
describe('Utility Functions', () => {
    test('generateId creates unique IDs', () => {
        const id1 = Utils.generateId('topic');
        const id2 = Utils.generateId('topic');
        expect(id1).toMatch(/^topic-[a-f0-9]{16}$/);
        expect(id2).toMatch(/^topic-[a-f0-9]{16}$/);
        expect(id1).not.toEqual(id2);
    });
    test('getCurrentTimestamp returns ISO string', () => {
        const ts = Utils.getCurrentTimestamp();
        expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
    test('calculateEngagementRate computes correctly', () => {
        const rate = Utils.calculateEngagementRate(100, 50, 25, 10000);
        expect(rate).toBeCloseTo(0.0175, 4);
    });
    test('scorePerformance returns 0-100', () => {
        const score = Utils.scorePerformance({
            views: 5000,
            engagement_rate: 0.05,
        });
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
    });
});
//# sourceMappingURL=sanity.test.js.map