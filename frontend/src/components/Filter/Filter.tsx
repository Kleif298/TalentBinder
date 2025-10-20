import "./Filter.scss";
import { useState } from "react";
import scope from "~/assets/scope.png";

const Filter = () => {
  const [isTalentOnly, setIsTalentOnly] = useState(false);

  return (
    <form className="filter">
      <input className="searchbar" type="text" placeholder="Suche"></input>
      <button
        className="talent-toggle-button"
        onClick={() => setIsTalentOnly(!isTalentOnly)}
      >
        <span>Talents only:</span>
        <div
          className={`talent-toggle-icon ${
            isTalentOnly ? "enabled" : "disabled"
          }`}
        ></div>
      </button>
      <div className="branche-dropdown"></div>
      <button>
        <img src={scope} alt="search icon" />
      </button>
    </form>
  );
};

export default Filter;
