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
      processedDeliciousnessData: null,
    };
  }

  componentDidMount() {
    this.loadDeliciousnessData(this.props.fruit.id);
  }

  componentDidUpdate(prevProps) {
    // console.log("Content::componentDidUpdate", this.props.fruit !== prevProps.fruit);
    if (this.props.fruit !== prevProps.fruit) {
      this.loadDeliciousnessData(this.props.fruit.id);
      this.setState({ currentFruitType: null });
    }

    if (this.props.autoRefresh && !prevProps.autoRefresh) {
      // console.log("Content::componentDidUpdate - Starting interval..");
      this.timerId = setInterval(() => this.loadDeliciousnessData(this.props.fruit.id), 5000);
    }

    if (!this.props.autoRefresh && prevProps.autoRefresh) {
      // console.log("Content::componentDidUpdate - Clearing interval..");
      clearInterval(this.timerId);
    }
  }

  componentWillUnmount() {
    // console.log("Content::componentWillUnmount - Clearing interval..");
    clearInterval(this.timerId);
  }

  loadDeliciousnessData(fruitId) {
    // console.log("Loading deliciousness data..");
    const { rawData, processedData } = ajax.fetchFruitTypeDeliciousness(fruitId);
    const deliciousnessData = rawData;
    const processedDeliciousnessData = processedData;
    this.setState({ deliciousnessData, processedDeliciousnessData });
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
            handleFruitTypeClick={this.fruitTypeSelectionHandler} />
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
