'use server';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendGigs = recommendGigs;
/**
 * @fileOverview A Genkit flow for recommending gigs to a user based on their recent orders.
 *
 * - recommendGigs - A function that takes a user's recent orders and returns a list of recommended gig titles.
 * - RecommendGigsInput - The input type for the recommendGigs function.
 * - RecommendGigsOutput - The return type for the recommendGigs function.
 */
var genkit_1 = require("../genkit");
var genkit_2 = require("genkit");
var RecommendGigsInputSchema = genkit_2.z.object({
    recentOrderTitles: genkit_2.z.array(genkit_2.z.string()).describe('A list of titles from the user\'s recent gig orders.'),
});
var RecommendGigsOutputSchema = genkit_2.z.object({
    recommendations: genkit_2.z.array(genkit_2.z.string()).describe('An array of recommended gig titles.'),
});
function recommendGigs(input) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, recommendGigsFlow(input)];
        });
    });
}
var prompt = genkit_1.ai.definePrompt({
    name: 'recommendGigsPrompt',
    input: { schema: RecommendGigsInputSchema },
    output: { schema: RecommendGigsOutputSchema },
    prompt: "You are a recommendation engine for a freelance marketplace called GigLink.\n  Your goal is to suggest relevant services to clients to encourage them to purchase more gigs.\n\n  Based on the following list of gig titles from a user's recent orders, recommend up to 3 other similar or complementary gig titles that they might be interested in.\n  Do not recommend titles that are too similar to the ones they've already purchased. Only return the titles.\n\n  Recent Orders:\n  {{#each recentOrderTitles}}\n  - {{{this}}}\n  {{/each}}\n  ",
});
var recommendGigsFlow = genkit_1.ai.defineFlow({
    name: 'recommendGigsFlow',
    inputSchema: RecommendGigsInputSchema,
    outputSchema: RecommendGigsOutputSchema,
}, function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // In a real app, you might have more complex logic here to fetch more user data.
                if (input.recentOrderTitles.length === 0) {
                    // If the user has no orders, recommend some popular services.
                    // This part doesn't use an LLM but could be expanded to do so.
                    return [2 /*return*/, { recommendations: [
                                'I will design a stunning modern logo',
                                'I will write compelling SEO blog posts',
                                'I will create a promotional video animation',
                            ] }];
                }
                return [4 /*yield*/, prompt(input)];
            case 1:
                output = (_a.sent()).output;
                return [2 /*return*/, output];
        }
    });
}); });
