import type { LiveLogBuffer, LogLine } from '../types';

export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const TIMESTAMP_PATTERN = /^\[\d{4}-\d{2}-\d{2} (\d{2}:\d{2}:\d{2})\]\s?(.*)$/;

export const EMPTY_LIVE_LOG_BUFFER: LiveLogBuffer = { lines: [], nextId: 0, lastLineOpen: false };

export function parseLogLine(raw: string, id: number): LogLine {
    const match = raw.match(TIMESTAMP_PATTERN);
    return match
        ? { id, raw, time: match[1], message: match[2] }
        : { id, raw, time: '', message: raw };
}

export function parseLogContent(content: string): LogLine[] {
    return content
        .split('\n')
        .filter(line => line.length > 0)
        .map((line, idx) => parseLogLine(line, idx));
}

export function appendLogChunk(
    buffer: LiveLogBuffer,
    chunk: string,
    maxLines: number
): LiveLogBuffer {
    const segments = chunk.split('\n');
    const lastSegment = segments[segments.length - 1];
    const lines = [...buffer.lines];
    let nextId = buffer.nextId;
    let startIdx = 0;

    const lastLine = lines[lines.length - 1];
    if (buffer.lastLineOpen && lastLine) {
        lines[lines.length - 1] = parseLogLine(lastLine.raw + segments[0], lastLine.id);
        startIdx = 1;
    }

    for (let i = startIdx; i < segments.length; i++) {
        if (segments[i].length === 0) continue;
        lines.push(parseLogLine(segments[i], nextId));
        nextId += 1;
    }

    const lastLineOpen = lastSegment.length > 0 || (segments.length === 1 && buffer.lastLineOpen);

    return {
        lines: lines.length > maxLines ? lines.slice(-maxLines) : lines,
        nextId,
        lastLineOpen,
    };
}

export function joinLogLines(lines: readonly LogLine[]): string {
    return lines.map(line => line.raw).join('\n');
}
