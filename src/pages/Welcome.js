import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      {/* MAIN LANDMARK */}
      <main>
        <h1>Welcome to spellCraft</h1>

        <p>
          SpellCraft is an audio-based English typing practice application.<br/>
        </p>

        <p>
          You will listen to words, sentences, or paragraphs and type
          exactly what you hear.<br/> 
This application is designed especially
          for Students and learners who want to improve their
          typing accuracy and listening skills.<br/>
        </p>

        <p>
         Each practice session includes difficulty levels, tutorials,
          timed typing tasks, and detailed results to help you track
          your progress.<br/>
        </p>

        <button onClick={() => navigate("/practice")}>
          Play
        </button>
      </main>

      {/* CONTENTINFO LANDMARK (OUTSIDE MAIN) */}
      <Footer/>
    </>
  );
}