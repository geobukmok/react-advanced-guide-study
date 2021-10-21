import { Link } from "react-router-dom";

const Lectures = () => (
    <nav>
        <h1>lectures</h1>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/lecture-detail">Lecture Detail</Link>
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

export default Lectures;