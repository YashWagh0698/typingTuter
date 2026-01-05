import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function TutorialList() {
  const { category, level } = useParams();
  const navigate = useNavigate();

  return (
<div>
    <main>
      <h2>
        {category} – {level} Tutorials
      </h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <li
            key={i}
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: "1rem" }}>
              Start tutorial {i + 1}
            </span>

            <button
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
<Footer/>
</div>
  );
}
