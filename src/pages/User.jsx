import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const User = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["Users", id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/users/${id}`);
      return data;
    },
    staleTime: Infinity,
  });

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    if (data) {
      setUsername(data.username);
      setEmail(data.email);
      setAge(data.age);
    }
  }, [data]);

  const modifyUser = useMutation({
    mutationFn: async (body) => {
      await axios.put(`http://localhost:3000/users/${data._id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Users"]);
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    modifyUser.mutate({ username, email, age });
  };

  if (isLoading) return <p>Chargement ...</p>;

  if (error) return <p>Une erreur est survenue : {error}</p>;

  return (
    <>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={username}
          placeholder="Nom"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="text"
          value={age}
          placeholder="Age"
          onChange={(e) => {
            setAge(e.target.value);
          }}
        />
        <button>Modifier les informations</button>
      </form>
    </>
  );
};

export default User;
