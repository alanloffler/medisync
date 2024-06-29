import { useParams } from "react-router-dom";

export default function ViewUser() {
  const {id} = useParams();
  return (
    <div>
      <h1>View User {id}</h1>
    </div>
  );
}