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
exports.generateGigImage = generateGigImage;
/**
 * @fileOverview A Genkit flow for generating an image for a gig based on its title.
 *
 * - generateGigImage - A function that takes a gig title and returns a data URI for a generated image.
 * - GenerateGigImageInput - The input type for the generateGigImage function.
 * - GenerateGigImageOutput - The return type for the generateGigImage function.
 */
var genkit_1 = require("../genkit");
var genkit_2 = require("genkit");
var GenerateGigImageInputSchema = genkit_2.z.string();
var GenerateGigImageOutputSchema = genkit_2.z.object({
    imageDataUri: genkit_2.z.string().describe("The generated image for the gig, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
function generateGigImage(promptText) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, generateGigImageFlow(promptText)];
        });
    });
}
var generateGigImageFlow = genkit_1.ai.defineFlow({
    name: 'generateGigImageFlow',
    inputSchema: GenerateGigImageInputSchema,
    outputSchema: GenerateGigImageOutputSchema,
}, function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
    var media;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, genkit_1.ai.generate({
                    model: 'googleai/gemini-2.0-flash-preview-image-generation',
                    prompt: "Generate an attractive, professional, and high-quality image that visually represents the following service or gig title. The image should be photorealistic or in a modern digital art style, suitable for a professional marketplace listing. Avoid using text in the image. Gig Title: ".concat(prompt),
                    config: {
                        responseModalities: ['TEXT', 'IMAGE'],
                    },
                })];
            case 1:
                media = (_a.sent()).media;
                if (!media.url) {
                    throw new Error('Image generation failed to produce an image.');
                }
                return [2 /*return*/, { imageDataUri: media.url }];
        }
    });
}); });
