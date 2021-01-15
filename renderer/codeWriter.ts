import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

export interface CodeWriter {
  write(path: string, content: Buffer): void;
}

export class FileCodeWriter implements CodeWriter {
  write(outputPath: string, content: Buffer): void {
    if (!outputPath || outputPath.length === 0) {
      throw Error(`File path is required`);
    }

    const dir = path.parse(outputPath).dir;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(outputPath, content, { encoding: 'utf8' });
  }
}