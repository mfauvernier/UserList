import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaTrashCan } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

const Home = () => {
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["Users"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/users");
      return data;
    },
    // staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Users"]);
    },
  });

  const createUser = useMutation({
    mutationFn: async (user) => {
      await axios.post("http://localhost:3000/users", user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Users"]);
      setShowForm(false);
    },
  });

  const usernameRef = useRef();
  const emailRef = useRef();
  const ageRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      age: ageRef.current.value,
    };
    createUser.mutate(user);
  };

  if (isLoading) return <p>Chargement ...</p>;

  if (error) return <p>Une erreur est survenue : {error}</p>;

  return (
    <>
      <button onClick={() => setShowForm(true)}>
        Créer un nouvel utilisateur
      </button>
      {showForm && (
        <form
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Nom"
            ref={usernameRef}
            style={{ margin: "10px" }}
            required
          />
          <input
            type="text"
            placeholder="Email"
            ref={emailRef}
            style={{ margin: "10px" }}
            required
          />
          <input
            type="text"
            placeholder="Age"
            ref={ageRef}
            style={{ margin: "10px" }}
            required
          />
          <button>Envoyer</button>
        </form>
      )}

      {data.map((user) => {
        return (
          <div
            key={user._id}
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            <p>{user.username}</p>
            <FaTrashCan onClick={() => deleteUser.mutate(user._id)} />
            <Link to={`users/${user._id}`}>
              <FaPencilAlt />
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default Home;
