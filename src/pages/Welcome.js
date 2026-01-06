import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      {/* MAIN LANDMARK */}
      <main>
        <h1>Welcome to TypeHear hi!</h1>

        <p>
          TypeHear is an audio-based English typing practice application.
        </p>

        <p>
          You will listen to words, sentences, or paragraphs and type
          exactly what you hear. This application is designed especially
          for screen reader users and learners who want to improve their
          typing accuracy and listening skills.
        </p>

        <p>
          Each practice session includes difficulty levels, tutorials,
          timed typing tasks, and detailed results to help you track
          your progress.
        </p>

        <button onClick={() => navigate("/practice")}>
          ▶ Play
        </button>
      </main>

      {/* CONTENTINFO LANDMARK (OUTSIDE MAIN) */}
      <Footer/>
    </>
  );
}
