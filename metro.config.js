// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add your custom resolver
config.resolver.extraNodeModules = {
  contexts: path.resolve(__dirname, 'contexts'),
};

module.exports = config; 