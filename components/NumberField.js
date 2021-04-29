import styles from "../styles/modules/Numberfield.module.scss";

export default function NumberField(props) {
  return (
    <div className="form-group">
      <label>
        <span className="d-block form-label">
          <strong>{props.label}</strong>
          <span className="d-block text-muted">{props.text}</span>
        </span>
        <div className="input-group">
          <input
            type="number"
            onChange={props.onChange}
            className="form-control"
          />
          <div className="input-group-text" type="button">
            <button
              className={`${styles.btn} ${
                props.color ? `text-${props.color}` : ""
              }`}
              type="button"
            >
              Max
            </button>
          </div>
        </div>
      </label>
    </div>
  );
}
