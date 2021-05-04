import styles from "../styles/modules/Numberfield.module.scss";

export default function NumberField(props) {
  const { color, onChange, setMax, value } = props;

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
            onChange={onChange}
            className="form-control"
            value={value}
          />
          <div className="input-group-text" type="button">
            <button
              className={`${styles.btn} ${color ? `text-${color}` : ""}`}
              type="button"
              onClick={() => setMax()}
            >
              Max
            </button>
          </div>
        </div>
      </label>
    </div>
  );
}
