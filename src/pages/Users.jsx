import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Users = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Users"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/users");
      return data;
    },
  });

  if (isLoading) return <p>Chargement ...</p>;

  if (error) return <p>Une erreur est survenue : {error}</p>;

  return (
    <>
      {data.map((user) => {
        return (
          <div key={user._id} style={{ display: "flex", gap: "20px" }}>
            <p>{user.username}</p>
            <p>{user.email}</p>
            <p>{user.age} ans</p>
          </div>
        );
      })}
    </>
  );
};

export default Users;
