const path = require('path')

const { DefinePlugin }       = require('webpack')
const HtmlWebpackPlugin      = require('html-webpack-plugin')
const MiniCssExtractPlugin   = require('mini-css-extract-plugin')
const TsConfigPathPlugin     = require('tsconfig-paths-webpack-plugin')
const { VueLoaderPlugin }    = require('vue-loader')
const SvgSprite              = require('svg-sprite-loader/plugin')


module.exports = (env: {[key: string]: boolean}) => {
    const IS_DEV    = env.development === true 
    const IS_PROD   = env.production  === true

    return {
        devtool     : IS_PROD ? false : 'eval-cheap-source-map',
        mode        : IS_PROD ? 'production': 'development',

        entry       : path.resolve(__dirname,'..','src/index.ts'),
        output      : {
            path                : path.resolve(__dirname, '..', 'dist'),
            clean               : true,
            filename            : '[name][contenthash].js',
            assetModuleFilename : 'images/[hash][ext][query]',
            publicPath          : IS_DEV ? '/' : './',
        },

        resolve: {
            extensions: ['.ts','.js','.vue','.json'],
            plugins: [new TsConfigPathPlugin()]
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        'babel-loader',
                        {
                            loader: 'ts-loader',
                            options: {
                                appendTsSuffixTo: [/\.vue$/],
                                transpileOnly: true
                            },
                        }
                    ]
                },
                {
                    test: /\.vue$/,
                    use: 'vue-loader',
                },
                {
                    test: /\.s?css$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                additionalData: `
                                    @import "styles/_variables.scss";
                                    @import "styles/_bem-mixin.scss";
                                    @import "styles/_medias.scss";
                                `
                            }
                        },
                        {
                            loader: "postcss-loader",
                        },
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.(woff,woff2,eot|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-sprite-loader',
                    options: {
                        extract: true,
                        spriteFilename: './icons.svg' // this is the destination of your sprite sheet
                    }
                }
            ]
        },

        plugins: [
            new SvgSprite({
                plainSprite: true
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '..', 'public', 'index.html'),
                title: "CuttleSystems",
                filename: "index.html",
            }),
            new MiniCssExtractPlugin({
                filename: IS_PROD ? '[name].[hash].css' : '[name].css',
            }),
            new VueLoaderPlugin(),
            new DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(IS_PROD ? 'production': 'development')
                },

                __VUE_OPTIONS_API__: JSON.stringify(true),
                __VUE_PROD_DEVTOOLS__: JSON.stringify(env.prodcution === false)
            })
        ],

        devServer: {
            hot: true,
            historyApiFallback: true,
            static: path.resolve(__dirname, "..", "public"),
            compress: true,
            open: true,
            port: "auto",
            client: {
                overlay: true,
            },
            proxy: {
                '/chart-flow/*': {
                    target: 'http://127.0.0.1:8000',
                    pathRewrite: {
                        '/chart-flow': ''
                    },
                    secure: false,
                    changeOrigin: true,
                    proxyTimeout: 5 * 60 * 1000,
                    timeout: 5 * 60 * 1000,
                },
                '/api': {
                    // target: `${config.devBackend.protocol}://${
                    //     config.devBackend.host
                    // }:${config.devBackend.port}`,
                    target: 'http://127.0.0.1:8000',
                    // pathRewrite: {
                    //     '/api': ''
                    // },
                    // bypass: function (req, res, opt) {
                    //     debugger
                    //     if (
                    //         req.path.startsWith(this.context) &&
                    //         ((req.headers.accept &&
                    //             req.headers.accept.indexOf('html') !== -1) ||
                    //             !req.headers.accept)
                    //     ) {
                    //         return '/customer/index.html';
                    //     }
                    // },
                    secure: false,
                    changeOrigin: true,
                    proxyTimeout: 5 * 60 * 1000,
                    timeout: 5 * 60 * 1000,
                },
            }
        },

        optimization: {
            moduleIds: "deterministic",
            runtimeChunk: "single",
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        priority: -10,
                        chunks: "all",
                    },
                },
            },
        },

        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }

    }

}