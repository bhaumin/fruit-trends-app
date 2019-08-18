import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import ajax from './utils/ajax';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fruits: [],
      currentFruitId: 1,
    };
  }

  componentDidMount() {
    const fruits = ajax.fetchAllFruits();
    this.setState({ fruits });
  }

  currentFruit = () => {
    return this.state.fruits.find((fruit) => fruit.id === this.state.currentFruitId);
  };

  fruitSelectionHandler = (fruitId) => {
    this.setState({
      currentFruitId: fruitId
    });
  };

  render() {
    const { fruits, currentFruitId } = this.state;
    const currentFruit = this.currentFruit();

    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row">
            <div className="col-2">
              <Sidebar
                fruits={fruits}
                currentFruitId={currentFruitId}
                handleClick={this.fruitSelectionHandler} />
            </div>
            <div className="col-offset-1 col-10">
              {currentFruit &&
                <Content fruit={currentFruit} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
