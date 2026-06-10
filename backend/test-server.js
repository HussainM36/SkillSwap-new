const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5003;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Test server is running!');
});

app.get('/api/auth/users', (req, res) => {
  res.json([{ id: 1, name: 'Test User', email: 'test@test.com' }]);
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
});

