// App
import { useParams } from 'react-router-dom';
import { ProfessionalApiService } from '../services/professional-api.service';
import { useEffect } from 'react';

export default function UpdateProfessional() {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      ProfessionalApiService.findOne(id).then((response) => console.log(response));
    }
  }, [id]);

  return <div>Update Professional {id}</div>;
}
