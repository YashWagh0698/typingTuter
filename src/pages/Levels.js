import { useParams, useNavigate } from "react-router-dom";
import { levels } from "../utils/levelsData";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";

export default function Levels() {
  const { category } = useParams();
  const navigate = useNavigate();

  return (
<div>
    <main>
<BackButton/>
      <h2>{category} Levels</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {levels.map((level, index) => (
          <li
            key={level}
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: "1rem" }}>
              Select level {index + 1}
            </span>

            <button
              onClick={() =>
                navigate(`/tutorials/${category}/${level}`)
              }
            >
              {level}
            </button>
          </li>
        ))}
      </ul>
    </main>
<Footer/>
</div>
  );
}
