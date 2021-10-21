import { Link } from "react-router-dom";

const Home = () => (
    <nav>
        <h1>Home</h1>
        <ul>
            <li>
                <Link to="/lectures">Lectures</Link>
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

export default Home;