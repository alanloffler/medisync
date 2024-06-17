import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfessionalApiService } from '../professionals/services/professional-api.service';
import { IProfessional } from '../professionals/interfaces/professional.interface';

export default function WhatsApp() {
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      ProfessionalApiService.findOne(id).then((response) => {
        setProfessional(response);
      });
    }
  }, [id]);

function sendMessage(e: any) {
  e.preventDefault();
  console.log(e.target[0].value, e.target[1].value);
}

  return (
    <div>
      <h1>WhatsApp for {professional.lastName} - {id}</h1>
      <form onSubmit={(e) => sendMessage(e)}>
        <input type="text" defaultValue={professional.phone} />
        <textarea />
        <button type='submit'>Enviar mensaje</button>
      </form>
    </div>
  );
}
