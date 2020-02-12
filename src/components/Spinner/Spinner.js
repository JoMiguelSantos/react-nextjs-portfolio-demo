import "./Spinner.scss";

const Spinner = () => {
  return (
    <div className="spinner">
      <div class="loading-spinner" role="alert" aria-live="assertive"></div>
      <p class="loading-spinner-copy">Content is loading...</p>
    </div>
  );
};

export default Spinner;
