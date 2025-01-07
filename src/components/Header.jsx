import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Link to="/">
        <p>Page Home</p>
      </Link>
      <Link to="/users">
        <p>Page Users</p>
      </Link>
    </div>
  );
};

export default Header;
