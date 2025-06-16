const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for importing TypeScript files
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

// Add support for importing from node_modules
config.resolver.nodeModulesPaths = [__dirname];

// Add support for importing from the project root
config.watchFolders = [__dirname];

module.exports = config; 