module.exports = {  
    transformIgnorePatterns: ['node_modules/(?!(sucrase)/)', "node_modules/(?!axios)/"],
    transform: {
      '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
    },
    // ...the rest of your config
  }