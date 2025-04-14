import Card from './components/Card';
import {useState, useEffect} from 'react'
import axios from 'axios';

export default function Home() {

  const [spaceData, setSpaceData] = useState([]) //need to have an empty array because of .map

  useEffect(() => {
    axios.get('/api/space').then((res) => {
      setSpaceData(res.data);
    })
  }, [])


  return (
    <main className="p-4 space-y-2">
      {spaceData.length
        ? <div className="flex flex-wrap gap-4">
          {spaceData.map((item) => (
            <Card
              key={item._id}
              title={item.name}
              imgUri={item.imageUri}
            >
              {item.description}
            </Card>
          ))}
        </div>
        : <p>Loading...</p>}
    </main>
  );
}
