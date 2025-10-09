/* migrated from config/logging.php */

export default {
    default: process.env.LOG_CHANNEL ?? 'stack',

    deprecations: {
        channel: process.env.LOG_DEPRECATIONS_CHANNEL ?? 'null',
        trace: process.env.LOG_DEPRECATIONS_TRACE === 'true' // Default is false, so if not 'true', it's false
    },

    channels: {
        stack: {
            driver: 'stack',
            channels: (process.env.LOG_STACK ?? 'single').split(',').map(s => s.trim()).filter(Boolean),
            ignore_exceptions: false
        },

        single: {
            driver: 'single',
            path: './logs/laravel.log', // Represents Laravel's storage_path('logs/laravel.log')
            level: process.env.LOG_LEVEL ?? 'debug',
            replace_placeholders: true
        },

        daily: {
            driver: 'daily',
            path: './logs/laravel.log', // Represents Laravel's storage_path('logs/laravel.log')
            level: process.env.LOG_LEVEL ?? 'debug',
            days: parseInt(process.env.LOG_DAILY_DAYS ?? '14', 10),
            replace_placeholders: true
        },

        slack: {
            driver: 'slack',
            url: process.env.LOG_SLACK_WEBHOOK_URL,
            username: process.env.LOG_SLACK_USERNAME ?? 'Laravel Log',
            emoji: process.env.LOG_SLACK_EMOJI ?? ':boom:',
            level: process.env.LOG_LEVEL ?? 'critical',
            replace_placeholders: true
        },

        papertrail: {
            driver: 'monolog',
            level: process.env.LOG_LEVEL ?? 'debug',
            handler: process.env.LOG_PAPERTRAIL_HANDLER ?? 'SyslogUdpHandler', // Represents SyslogUdpHandler::class
            handler_with: {
                host: process.env.PAPERTRAIL_URL,
                port: parseInt(process.env.PAPERTRAIL_PORT, 10),
                connectionString: `tls://${process.env.PAPERTRAIL_URL}:${process.env.PAPERTRAIL_PORT}`
            },
            processors: ['PsrLogMessageProcessor'] // Represents [PsrLogMessageProcessor::class]
        },

        stderr: {
            driver: 'monolog',
            level: process.env.LOG_LEVEL ?? 'debug',
            handler: 'StreamHandler', // Represents StreamHandler::class
            handler_with: {
                stream: 'process.stderr' // Maps 'php://stderr' to a string representation for Node.js stderr stream
            },
            formatter: process.env.LOG_STDERR_FORMATTER,
            processors: ['PsrLogMessageProcessor'] // Represents [PsrLogMessageProcessor::class]
        },

        syslog: {
            driver: 'syslog',
            level: process.env.LOG_LEVEL ?? 'debug',
            facility: process.env.LOG_SYSLOG_FACILITY ?? 'LOG_USER', // Represents LOG_USER PHP constant
            replace_placeholders: true
        },

        errorlog: {
            driver: 'errorlog',
            level: process.env.LOG_LEVEL ?? 'debug',
            replace_placeholders: true
        },

        null: {
            driver: 'monolog',
            handler: 'NullHandler' // Represents NullHandler::class
        },

        emergency: {
            path: './logs/laravel.log' // Represents Laravel's storage_path('logs/laravel.log')
        }
    }
};
