const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// NativeWind compiles global.css (Tailwind) into the style data that className reads at runtime
module.exports = withNativeWind(config, { input: './global.css' });
