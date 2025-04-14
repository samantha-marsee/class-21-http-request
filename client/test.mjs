import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

axios.get('/api/space')
  .then((response) => {
    const spaceData = response.data.forEach(item => console.log(item.name));
  })
