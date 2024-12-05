module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!(sucrase|axios)/)', // Allow sucrase and axios to be transformed by Babel
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest', // Transform JS/TS files with Babel
  },
  moduleNameMapper: {
    //'^axios$': 'axios/dist/node/axios.cjs', // Ensure axios uses CommonJS version
    "^axios$": "axios",
  },
  resolver: undefined

  
};
