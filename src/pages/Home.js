import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import Header from "../components/Header";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      <main className="home-main">

        <div className="home-top-bar">
          <BackButton />
        </div>

        <section className="home-container">
          <h1 className="home-title">
            Typing Practice (Audio Based)
          </h1>

          <ul className="practice-list">
            <li className="practice-item">
              <span className="practice-text">
                Click here for words practice
              </span>
              <button
                className="secondary-button"
                onClick={() => navigate("/levels/words")}
              >
                Word Practice
              </button>
            </li>

            <li className="practice-item">
              <span className="practice-text">
                Click here for sentence practice
              </span>
              <button
                className="secondary-button"
                onClick={() => navigate("/levels/sentences")}
              >
                Sentence Practice
              </button>
            </li>

            <li className="practice-item">
              <span className="practice-text">
                Click here for paragraph practice
              </span>
              <button
                className="secondary-button"
                onClick={() => navigate("/levels/paragraphs")}
              >
                Paragraph Practice
              </button>
            </li>
          </ul>
        </section>

      </main>

      <Footer />
    </div>
  );
}