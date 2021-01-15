/// <reference types="node" />
export interface CodeWriter {
    write(path: string, content: Buffer): void;
}
export declare class FileCodeWriter implements CodeWriter {
    write(outputPath: string, content: Buffer): void;
}
