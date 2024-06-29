// App
import { useParams } from "react-router-dom"
// React component
export default function UpdateUser() {
  const {id} = useParams();

  return <>Update user {id}</>
}