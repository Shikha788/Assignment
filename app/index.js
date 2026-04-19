const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Trust proxy to get the correct visitor IP when behind a load balancer
app.set('trust proxy', true);

app.get('/', (req, res) => {
  const response = {
    timestamp: new Date().toISOString(),
    ip: req.ip
  };
  res.json(response);
});

app.listen(port, () => {
  console.log(`SimpleTimeService listening at http://localhost:${port}`);
});
