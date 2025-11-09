module.exports = {
  'lexxadata-api': {
    // A name for the generated client
    input: 'http://127.0.0.1:8001/openapi.json', // URL to your running FastAPI backend's schema
    output: {
      target: './src/api/lexxadata.ts', // Where to save the generated file
      client: 'axios', // The HTTP client to use
      mock: false, // You can also generate mock data
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write', // Optional: auto-format the generated file
    },
  },
}
