const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');
const timestampHash = Date.now();

module.exports = {
    devServer: devServerConfig => {
        devServerConfig.headers = {
            'Cache-Control': 'no-store',
        };
        devServerConfig.hot = true;
        devServerConfig.liveReload = true;
        return devServerConfig;
    },
    webpack: {
        configure: webpackConfig => {
            webpackConfig.output.filename = `static/js/[name].${timestampHash}.js`;
            webpackConfig.output.chunkFilename = `static/js/[name].${timestampHash}.chunk.js`;

            const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find(plugin => plugin instanceof MiniCssExtractPlugin);
            if (instanceOfMiniCssExtractPlugin) {
                instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;
                instanceOfMiniCssExtractPlugin.options.filename = `static/css/[name].${timestampHash}.css`;
                instanceOfMiniCssExtractPlugin.options.chunkFilename = `static/css/[name].${timestampHash}.chunk.css`;
            }

            const optimization = webpackConfig.optimization;
            if (optimization) {
                optimization.minimizer = [
                    new TerserPlugin({
                        terserOptions: {
                            compress: {
                                drop_console: true,
                                drop_debugger: true,
                            },
                            output: {
                                comments: false,
                            },
                            keep_classnames: false,
                            keep_fnames: false,
                        },
                        parallel: true,
                        extractComments: false,
                    }),
                ];
            }

            webpackConfig.module.rules.forEach(rule => {
                if (rule.oneOf) {
                    rule.oneOf.forEach(oneOfRule => {
                        if (oneOfRule.test && /\.(js|mjs|jsx|ts|tsx)$/.test(oneOfRule.test.toString())) {
                            if (!oneOfRule.use) {
                                oneOfRule.use = [];
                            }

                            oneOfRule.use.unshift({
                                loader: require.resolve('thread-loader'),
                                options: {
                                    workers: Math.max(1, os.cpus().length - 1),
                                    cache: true,
                                },
                            });
                        }
                    });
                }
            });

            return webpackConfig;
        },
    },
    plugins: [
        {
            plugin: require('craco-babel-loader'),
            options: {
                includes: [path.resolve('node_modules/fast-png')],
            },
        },
        {
            plugin: require('craco-alias'),
            options: {
                source: 'tsconfig',
                baseUrl: './src',
                tsConfigPath: './tsconfig.paths.json',
            },
        },
    ],
    babel: {
        plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: false }],
            ['@babel/plugin-proposal-private-methods', { loose: false }],
            ['@babel/plugin-proposal-private-property-in-object', { loose: false }],
        ],
    },
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
};
