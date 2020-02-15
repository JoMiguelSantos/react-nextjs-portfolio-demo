import "./Spinner.scss";

const Spinner = ({ message, size = "medium" }) => {
  return (
    <div className="spinner">
      <div
        className={`loading-spinner ${size}`}
        role="alert"
        aria-live="assertive"
      ></div>
      <p className={`loading-spinner-copy ${size}`}>
        {message || "Content is loading..."}
      </p>
    </div>
  );
};

export default Spinner;
