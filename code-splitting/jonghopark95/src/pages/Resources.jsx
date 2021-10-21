import { Link } from "react-router-dom";

const Resources = () => (
    <nav>
        <h1>Resources</h1>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/lectures">Lectures</Link>
            </li>
            <li>
                <Link to="/lecture-detail">Lecture Detail</Link>
            </li>
            <li>
                <Link to="/resource-detail">Resource Detail</Link>
            </li>
        </ul>
    </nav>
);

export default Resources;