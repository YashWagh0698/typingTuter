import { useParams, useNavigate } from "react-router-dom";
import { levels } from "../utils/levelsData";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import Header from "../components/Header";

export default function Levels() {
  const { category } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      <main className="levels-main">

        <div className="levels-top-bar">
          <BackButton />
        </div>

        <section className="levels-container">
          <h2 className="levels-title">
            {category} Levels
          </h2>

          <ul className="levels-list">
            {levels.map((level, index) => (
              <li key={level} className="levels-item">

                <span className="levels-text">
                  Select level {index + 1}
                </span>

                <button
                  className="secondary-button"
                  onClick={() =>
                    navigate(`/tutorials/${category}/${level}`)
                  }
                >
                  {level}
                </button>

              </li>
            ))}
          </ul>

        </section>
      </main>

      <Footer />
    </div>
  );
}