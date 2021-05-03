import { useState } from "react";
import { connect } from "react-redux";
import { filterAssets } from "redux/actions/assets.actions";
import SearchIcon from "../../icons/SearchIcon";
import styles from "../../styles/modules/Assets/AssetsFilterField.module.scss";

function AssetsFilterField(props) {
  const { handleFilterAssets } = props;
  // const [filterValue, setFilterValue] = useState("");

  const handleFilter = (value) => {
    handleFilterAssets(value);
  };

  return (
    <form>
      <div className={`position-relative ${styles.el}`}>
        <input
          type="text"
          className="form-control"
          onChange={(e) => handleFilter(e.target.value)}
          id="exampleFormControlInput1"
          placeholder="Filter by Token, Protocol...."
        />
        <button className={styles.btn} type="button">
          <SearchIcon />
        </button>
      </div>
    </form>
  );
}

const mapStatesToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleFilterAssets: (value) => dispatch(filterAssets(value)),
  };
};

export default connect(mapStatesToProps, mapDispatchToProps)(AssetsFilterField);
