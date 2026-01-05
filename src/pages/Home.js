import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
<div>
    <main>
      <h1>Typing Practice (Audio Based)</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "1rem" }}>
            Click here for words practice
          </span>
          <button onClick={() => navigate("/levels/words")}>
            Word Practice
          </button>
        </li>

        <li style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "1rem" }}>
            Click here for sentence practice
          </span>
          <button onClick={() => navigate("/levels/sentences")}>
            Sentence Practice
          </button>
        </li>

        <li style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "1rem" }}>
            Click here for paragraph practice
          </span>
          <button onClick={() => navigate("/levels/paragraphs")}>
            Paragraph Practice
          </button>
        </li>
      </ul>
    </main>
<Footer/>
</div>
  );
}
