import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

const Sidebar = props => {

  const { fruits, currentFruitId, handleFruitClick, autoRefresh, autoRefreshInterval, handleAutoRefreshClick } = props;

  const getClassesToUse = (fruitId) => {
    const defaultButtonClasses = ["list-group-item", "list-group-item-action"];
    const selectedButtonClasses = defaultButtonClasses.concat("active");
    const classesToUse = fruitId === currentFruitId ? selectedButtonClasses : defaultButtonClasses;

    return classesToUse.join(" ");
  }

  const autoRefreshIconClasses = (autoRefresh ? [ "auto-refresh-icon", "active" ] : [ "auto-refresh-icon" ]).join(" ");
  const autoRefreshIconText = (autoRefresh ? `Auto Refresh : On (${autoRefreshInterval}s)` : "Auto Refresh : Off");

  return (
    <div>
      <div className={autoRefreshIconClasses} onClick={handleAutoRefreshClick}>
        <small><FontAwesome name="refresh" /> {autoRefreshIconText}</small>
      </div>
      <div className="list-group">
        {fruits.map(fruit =>
          <button
            type="button"
            key={fruit.id}
            onClick={() => handleFruitClick(fruit.id)}
            className={getClassesToUse(fruit.id)}>
              {fruit.name}
          </button>
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  fruits: PropTypes.array.isRequired,
  currentFruitId: PropTypes.number,
  handleFruitClick: PropTypes.func.isRequired,
  autoRefresh: PropTypes.bool.isRequired,
  autoRefreshInterval: PropTypes.number.isRequired,
  handleAutoRefreshClick: PropTypes.func.isRequired,
};

export default Sidebar;
