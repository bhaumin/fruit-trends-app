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
      currentFruitId: null,
      autoRefresh: false,
    };
  }

  componentDidMount() {
    this.loadAllFruits();
  }

  componentDidUpdate(_, prevState) {
    if (this.state.autoRefresh && !prevState.autoRefresh) {
      // console.log("App::componentDidUpdate - Starting interval..");
      this.timerId = setInterval(this.loadAllFruits, 5000);
    }

    if (!this.state.autoRefresh && prevState.autoRefresh) {
      // console.log("App::componentDidUpdate - Clearing interval..");
      clearInterval(this.timerId);
    }
  }

  componentWillUnmount() {
    // console.log("App::componentWillUnmount - Clearing interval..");
    clearInterval(this.timerId);
  }

  loadAllFruits = () => {
    // console.log("Load fruits..");
    const fruits = ajax.fetchAllFruits();
    this.setState({ fruits });
  };

  currentFruit = () => {
    return this.state.fruits.find((fruit) => fruit.id === this.state.currentFruitId);
  };

  fruitSelectionHandler = (fruitId) => {
    this.setState({
      currentFruitId: fruitId
    });
  };

  autoRefreshToggleHandler = () => {
    this.setState({
      autoRefresh: !this.state.autoRefresh
    });
  };

  render() {
    const { fruits, currentFruitId, autoRefresh } = this.state;
    const currentFruit = this.currentFruit();

    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row">
            <div className="col-2">
              <Sidebar
                fruits={fruits}
                currentFruitId={currentFruitId}
                handleFruitClick={this.fruitSelectionHandler}
                autoRefresh={autoRefresh}
                handleAutoRefreshClick={this.autoRefreshToggleHandler} />
            </div>
            <div className="col-offset-1 col-10">
              {currentFruit &&
                <Content fruit={currentFruit}
                  autoRefresh={autoRefresh} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
