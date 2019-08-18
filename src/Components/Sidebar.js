import React from 'react';

const Sidebar = props => {

  const { fruits, currentFruitId, handleClick } = props;

  const getClassesToUse = (fruitId) => {
    const defaultButtonClasses = ["list-group-item", "list-group-item-action"];
    const selectedButtonClasses = defaultButtonClasses.concat("active");
    const classesToUse = fruitId === currentFruitId ? selectedButtonClasses : defaultButtonClasses;

    return classesToUse.join(" ");
  }

  return (
    <div>
      <div className="list-group">
        {fruits.map(fruit =>
          <button
            type="button"
            key={fruit.id}
            onClick={() => handleClick(fruit.id)}
            className={getClassesToUse(fruit.id)}>
              {fruit.name}
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
