import { Link } from "react-router-dom";

const LectureDetail = () => (
    <nav>
        <h1>Lecture Detail</h1>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/lecture">Lecture</Link>
            </li>
            <li>
                <Link to="/resources">Resources</Link>
            </li>
            <li>
                <Link to="/resource-detail">Resource Detail</Link>
            </li>
        </ul>
    </nav>
);

export default LectureDetail;