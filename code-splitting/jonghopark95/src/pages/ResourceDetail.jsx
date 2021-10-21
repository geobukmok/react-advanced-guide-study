import { Link } from "react-router-dom";

const ResourceDetail = () => (
    (
        <nav>
            <h1>ResourceDetail</h1>
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
                    <Link to="/resources">Resource</Link>
                </li>
            </ul>
        </nav>
    )
)

export default ResourceDetail;