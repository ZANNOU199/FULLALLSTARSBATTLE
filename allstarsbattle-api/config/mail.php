<?php

return [

    'default' => env('MAIL_MAILER', 'smtp'),

    'mailers' => [

        'smtp' => [
            'transport' => 'smtp',
            'scheme' => env('MAIL_SCHEME', 'smtp'),
            'url' => env('MAIL_URL'),
            'host' => 'allstarbattle.dance', // Hardcoded for o2switch
            'port' => 465, // Hardcoded for o2switch
            'username' => 'contact@allstarbattle.dance', // Hardcoded for o2switch
            'password' => 'aO2h[_LYKgFo2_kY', // Hardcoded for o2switch
            'timeout' => 10,
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url((string) env('APP_URL', 'http://localhost'), PHP_URL_HOST)),
            'stream' => [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ],
            ],
        ],

        'sendmail' => [
            'transport' => 'sendmail',
            'path' => env('MAIL_SENDMAIL_PATH', '/usr/sbin/sendmail -t -i'),
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => ['sendmail', 'log'],
            'retry_after' => 60,
        ],

    ],

    'from' => [
        'address' => 'contact@allstarbattle.dance', // Hardcoded for o2switch
        'name' => 'All Stars Battle', // Hardcoded for o2switch
    ],

];