import './App.css';
import { Card } from 'antd';
import SearchForm from './components/Form/Form';


function App() {
  return (
    <Card title="Today's Weather">
      <SearchForm></SearchForm>
    </Card>
  );
}

export default App;
