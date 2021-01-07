"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileCodeWriter = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class FileCodeWriter {
    write(outputPath, content) {
        if (!outputPath || outputPath.length === 0) {
            throw Error(`File path is required`);
        }
        const dir = path_1.default.parse(outputPath).dir;
        if (!fs_1.existsSync(dir)) {
            fs_1.mkdirSync(dir, { recursive: true });
        }
        fs_1.writeFileSync(outputPath, content, { encoding: 'utf8' });
    }
}
exports.FileCodeWriter = FileCodeWriter;
