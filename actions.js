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
exports.generateTagsAction = generateTagsAction;
exports.generateDescriptionAction = generateDescriptionAction;
exports.generateImageAction = generateImageAction;
exports.supportChatAction = supportChatAction;
exports.recommendGigsAction = recommendGigsAction;
exports.translateTextAction = translateTextAction;
var generate_gig_tags_1 = require("./ai/flows/generate-gig-tags");
var generate_gig_image_1 = require("./ai/flows/generate-gig-image");
var support_chat_flow_1 = require("./ai/flows/support-chat-flow");
var generate_gig_description_1 = require("./ai/flows/generate-gig-description");
var recommend_gigs_1 = require("./ai/flows/recommend-gigs");
var translate_text_1 = require("./ai/flows/translate-text");
function generateTagsAction(input) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, generate_gig_tags_1.generateGigTags)(input)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.tags];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error generating tags:", error_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function generateDescriptionAction(input) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, generate_gig_description_1.generateGigDescription)(input)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.description];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error generating description:", error_2);
                    return [2 /*return*/, "We couldn't generate a description right now. Please try again or write one manually."];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function generateImageAction(title) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, generate_gig_image_1.generateGigImage)(title)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.imageDataUri];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error generating image:", error_3);
                    // Return a more structured error response
                    return [2 /*return*/, { error: "Failed to generate image. Please try again." }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function supportChatAction(input) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, support_chat_flow_1.supportChat)(input)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.response];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error in support chat:", error_4);
                    return [2 /*return*/, "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment."];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function recommendGigsAction(input) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, recommend_gigs_1.recommendGigs)(input)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.recommendations];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error recommending gigs:", error_5);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function translateTextAction(input) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, translate_text_1.translateText)(input)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.translation];
                case 2:
                    error_6 = _a.sent();
                    console.error("Error translating text:", error_6);
                    return [2 /*return*/, "Error: Could not translate to ".concat(input.targetLanguage, ".")];
                case 3: return [2 /*return*/];
            }
        });
    });
}
