import { useLocation, useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Result() {
  const { category, level, tutorial } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Results passed from Task.js OR fallback from sessionStorage
  const results =
    location.state?.results ||
    JSON.parse(
      sessionStorage.getItem(
        `tutorial-${category}-${level}-${tutorial}`
      )
    ) ||
    [];

  // Total characters of all 10 tasks
  const totalCharacters = results.reduce(
    (sum, task) => sum + task.totalCharacters,
    0
  );

  // Total correct characters typed by user
  const totalCorrectCharacters = results.reduce(
    (sum, task) => sum + task.correctCharacters,
    0
  );

  // Accuracy formula
  const accuracy =
    totalCharacters > 0
      ? (totalCorrectCharacters / totalCharacters) * 100
      : 0;

  return (
<div>
    <main>
      <h2>
        Result — {category} | {level} | Tutorial {tutorial}
      </h2>

      <section aria-live="polite">
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

      <hr />

      <section>
        <h3>Task-wise Details</h3>

        <table border="1" cellPadding="6" cellSpacing="0">
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
      </section>

      <br />

      <button
        onClick={() => {
          sessionStorage.removeItem(
            `tutorial-${category}-${level}-${tutorial}`
          );
          navigate("/");
        }}
      >
        Go to Home
      </button>
    </main>
<Footer/>
</div>
  );
}
