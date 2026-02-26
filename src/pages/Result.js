import { useLocation, useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Result() {
  const { category, level, tutorial } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const results =
    location.state?.results ||
    JSON.parse(
      sessionStorage.getItem(
        `tutorial-${category}-${level}-${tutorial}`
      )
    ) ||
    [];

  const totalCharacters = results.reduce(
    (sum, task) => sum + task.totalCharacters,
    0
  );

  const totalCorrectCharacters = results.reduce(
    (sum, task) => sum + task.correctCharacters,
    0
  );

  const accuracy =
    totalCharacters > 0
      ? (totalCorrectCharacters / totalCharacters) * 100
      : 0;

  return (
    <div>
      <main className="result-main">

        <section className="result-container">
          <h2 className="result-title">
            Result — {category} | {level} | Tutorial {tutorial}
          </h2>

          <section
            className="result-summary"
            aria-live="polite"
          >
            <p>
              <strong>Total characters:</strong> {totalCharacters}
            </p>
            <p>
              <strong>Correct characters:</strong>{" "}
              {totalCorrectCharacters}
            </p>
            <p>
              <strong>Accuracy:</strong>{" "}
              {accuracy.toFixed(2)}%
            </p>
          </section>

          <hr className="result-divider" />

          <section className="result-details">
            <h3 className="result-subtitle">
              Task-wise Details
            </h3>

            <div className="table-wrapper">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Correct Text</th>
                    <th>You Typed</th>
                    <th>Total Characters</th>
                    <th>Correct Characters</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((task) => (
                    <tr key={task.taskNumber}>
                      <td>{task.taskNumber}</td>
                      <td>{task.correctText}</td>
                      <td>{task.userText || "(No input)"}</td>
                      <td>{task.totalCharacters}</td>
                      <td>{task.correctCharacters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="result-button-wrapper">
            <button
              className="primary-button"
              onClick={() => {
                sessionStorage.removeItem(
                  `tutorial-${category}-${level}-${tutorial}`
                );
                navigate("/");
              }}
            >
              Go to Home
            </button>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}