import { useDispatch } from "react-redux";
import { setFilterValue } from "redux/actions/user.actions";
import SearchIcon from "../../icons/SearchIcon";
import styles from "../../styles/modules/Assets/AssetsFilterField.module.scss";

function AssetsFilterField(props) {
  const dispatch = useDispatch();

  const handleFilter = (e) => {
    dispatch(setFilterValue(e.target.value));
  };

  return (
    <div className={`position-relative ${styles.el}`}>
      <input
        type="text"
        className="form-control"
        onChange={(e) => handleFilter(e)}
        id="exampleFormControlInput1"
        placeholder="Filter by Token, Protocol...."
      />
      <button className={styles.btn} type="button">
        <SearchIcon />
      </button>
    </div>
  );
}

export default AssetsFilterField;
