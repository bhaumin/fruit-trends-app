import React from 'react';
import PropTypes from 'prop-types';
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

  static propTypes = {
    fruit: PropTypes.object.isRequired,
    autoRefresh: PropTypes.bool.isRequired,
    autoRefreshInterval: PropTypes.number.isRequired,
  };

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
      this.timerId = setInterval(() => this.loadDeliciousnessData(this.props.fruit.id), this.props.autoRefreshInterval * 1000);
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
    const deliciousnessData = ajax.fetchFruitTypeDeliciousness(fruitId);
    this.setState({ deliciousnessData });
  }

  currentFruitTypeDeliciousnessData = () => {
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
          {deliciousnessData &&
            <FruitTypeList
              fruit={fruit}
              currentFruitType={currentFruitType}
              deliciousnessData={deliciousnessData}
              handleFruitTypeClick={this.fruitTypeSelectionHandler} />
          }
        </div>

        <div className="row">
          {deliciousnessData && currentFruitType &&
            <FruitTypeChart
              fruit={fruit}
              currentFruitType={currentFruitType}
              currentFruitTypeDeliciousnessData={this.currentFruitTypeDeliciousnessData()} />
          }
        </div>
      </div>
    );
  }
}

export default Content;
