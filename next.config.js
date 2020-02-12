// next.config.js
require("dotenv").config();

const withPlugins = require("next-compose-plugins");
const withSass = require("@zeit/next-sass");

const nextConfiguration = {
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    MONGODB_URI: process.env.MONGODB_URI,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_SCOPE: process.env.AUTH0_SCOPE,
    REDIRECT_URI:
      process.env.REDIRECT_URI || "http://localhost:3000/auth/callback",
    POST_LOGOUT_REDIRECT_URI:
      process.env.POST_LOGOUT_REDIRECT_URI || "http://localhost:3000/",
    SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
    SESSION_COOKIE_LIFETIME: process.env.SESSION_COOKIE_LIFETIME // 2 hours
  }
};

module.exports = withPlugins(
  [
    withSass({
      // this allows the SASS to be modular
      module: {
        rules: [
          {
            test: /\.(s*)css$/,
            use: ["css-loader", "sass-loader"]
          }
        ]
      },
      sassLoaderOptions: {},
      // This configuration is capable of parsing following file types:
      // Sass and css files
      // Font files (.eot, .woff, .woff2)
      // Image files (.png, jpg, .gif, .svg)
      webpack(config, options) {
        config.module.rules.push({
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 100000
            }
          }
        });

        return config;
      }
    })
  ],
  nextConfiguration
);
