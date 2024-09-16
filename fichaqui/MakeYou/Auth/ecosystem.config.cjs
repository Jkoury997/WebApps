module.exports = {
    apps: [
      {
        name: 'Auth-Fichaqui-Zalei',
        script: 'bun',
        args: 'run src/app.js',
        interpreter: 'none',  // Esto le dice a PM2 que no use el intérprete de Node.js
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };