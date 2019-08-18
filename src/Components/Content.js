import React from 'react';
import FruitTypeList from './FruitTypeList';
import FruitTypeChart from './FruitTypeChart';
import ajax from '../utils/ajax';

class Content extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentFruitType: null,
      deliciousnessData: null,
    };
  }

  componentDidMount() {
    this.loadDeliciousnessData(this.props.fruit.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.fruit !== prevProps.fruit) {
      this.loadDeliciousnessData(this.props.fruit.id);
      this.setState({ currentFruitType: null });
    }
  }

  loadDeliciousnessData(fruitId) {
    const deliciousnessData = ajax.fetchFruitTypeDeliciousness(fruitId);
    this.setState({ deliciousnessData });
  }

  currentFruitTypeDeliciousness = () => {
    return this.state.deliciousnessData && this.state.currentFruitType &&
    this.state.deliciousnessData.hasOwnProperty(this.state.currentFruitType)
      ? this.state.deliciousnessData[this.state.currentFruitType]
      : null;
  };

  fruitTypeSelectionHandler = (fruitType) => {
    this.setState({
      currentFruitType: fruitType
    });
  };

  render() {
    const { fruit } = this.props;
    const { currentFruitType, deliciousnessData } = this.state;

    return (
      <div className="container content">
        <div className="row">
          <FruitTypeList
            fruit={fruit}
            currentFruitType={currentFruitType}
            deliciousnessData={deliciousnessData}
            handleClick={this.fruitTypeSelectionHandler} />
        </div>
        {currentFruitType &&
          <div className="row">
            <FruitTypeChart
              fruit={fruit}
              currentFruitType={currentFruitType}
              currentFruitTypeDeliciousness={this.currentFruitTypeDeliciousness()} />
          </div>
        }
      </div>
    );
  }
}

export default Content;