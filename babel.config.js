// Configuración de Babel para Expo (React Native).
// El preset "babel-preset-expo" incluye todo lo necesario para
// React, React Native y características modernas de JS.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
