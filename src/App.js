
import './App.css';
import Container from './components/Container';
import Content from './components/Content';
import Header from './components/Header';
import Login from './components/Login';
import Sider from './components/Sider';
import AppRouter from './router';

function App() {
  return (
    <div className="App">
      <Login><AppRouter/></Login>
    
   
    </div>
  );
}

export default App;
