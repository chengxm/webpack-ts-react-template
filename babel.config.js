module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: 'defaults',
                modules: false,
                useBuiltIns: "usage",
                corejs: 3,
            }
        ],
        ["@babel/preset-react", { runtime: "automatic" }],
        "@babel/preset-typescript"
    ]
}