import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import Header from "../components/Header";

export default function TutorialList() {
  const { category, level } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      <main className="tutorial-main">

        <div className="tutorial-top-bar">
          <BackButton />
        </div>

        <h2 className="tutorial-heading">
          {category} – {level} Tutorials
        </h2>

        <ul className="tutorial-list">
          {Array.from({ length: 10 }, (_, i) => (
            <li key={i} className="tutorial-item">

              <span className="tutorial-text">
                Start tutorial {i + 1}
              </span>

              <button
                className="tutorial-button"
                onClick={() =>
                  navigate(
                    `/task/${category}/${level}/${i + 1}/1`
                  )
                }
              >
                Tutorial {i + 1}
              </button>

            </li>
          ))}
        </ul>

      </main>

      <Footer />
    </div>
  );
}