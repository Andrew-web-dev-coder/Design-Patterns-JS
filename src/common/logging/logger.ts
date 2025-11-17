import pino from "pino";

// ------------------------------
// БАЗОВАЯ КОНФИГУРАЦИЯ PINO
// ------------------------------
export const logger = pino({
    level: "info",

    transport: {
        targets: [
            {
                target: "pino-pretty",
                level: "info",
                options: {
                    colorize: true,
                },
            },
            {
                target: "pino/file",
                level: "info",
                options: {
                    destination: "logs/app.log",
                    mkdir: true,
                },
            },
        ],
    },
});

// ------------------------------
// ОБЕРТКА ДЛЯ ТЕСТОВ + ЧИСТЫЙ API
// ------------------------------
export class Logger {
    static info(message: string, ...args: unknown[]): void {
        logger.info({ args }, `ℹ️  INFO: ${message}`);
    }

    static success(message: string, ...args: unknown[]): void {
        logger.info({ args }, `✅ SUCCESS: ${message}`);
    }

    static warn(message: string, ...args: unknown[]): void {
        logger.warn({ args }, `⚠️  WARNING: ${message}`);
    }

    static error(message: string, ...args: unknown[]): void {
        logger.error({ args }, `❌ ERROR: ${message}`);
    }
}
