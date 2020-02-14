import "./Spinner.scss";

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="loading-spinner" role="alert" aria-live="assertive"></div>
      <p className="loading-spinner-copy">Content is loading...</p>
    </div>
  );
};

export default Spinner;
