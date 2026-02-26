import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      {/* MAIN LANDMARK */}
      <main className="welcome-main">
        <section className="welcome-container">

          <h1 className="welcome-title">
            Welcome to <span className="brand-highlight">SpellCraft</span>
          </h1>

          <p className="welcome-text">
            SpellCraft is an audio-based English typing practice application.
          </p>

          <p className="welcome-text">
            You will listen to words, sentences, or paragraphs and type
            exactly what you hear. This application is designed especially
            for students and learners who want to improve their typing
            accuracy and listening skills.
          </p>

          <p className="welcome-text">
            Each practice session includes difficulty levels, tutorials,
            timed typing tasks, and detailed results to help you track
            your progress.
          </p>

          <div className="welcome-button-wrapper">
            <button
              className="primary-button"
              onClick={() => navigate("/practice")}
            >
              Play
            </button>
          </div>

        </section>
      </main>

      {/* CONTENTINFO LANDMARK */}
      <Footer />
    </>
  );
}