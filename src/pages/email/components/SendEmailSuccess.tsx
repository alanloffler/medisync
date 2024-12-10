// Icons: https://lucide.dev/icons/
import { MailCheck } from 'lucide-react';
// External imports
import NumberFlow from '@number-flow/react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Imports
import { APP_CONFIG } from '@config/app.config';
// React component
export function SendEmailSuccess() {
  const [countdown, setCountdown] = useState<number>(APP_CONFIG.redirectTime / 1000);
  const navigate = useNavigate();

  useEffect(() => {
    let seconds: number = 5;

    const interval = setInterval(() => {
      setCountdown(seconds);

      if (seconds === 0) {
        clearInterval(interval);
        navigate(-1);
      }

      seconds--;
    }, 1000);
  }, [navigate]);

  return (
    <section className='flex flex-row items-center gap-3 text-sm'>
      <MailCheck size={20} strokeWidth={2} className='stroke-emerald-400' />
      <div>
        <Trans
          i18nKey='email.sentSuccess'
          values={{ seconds: countdown }}
          components={{ NumberFlow: <NumberFlow value={countdown} className='font-semibold' /> }}
        />
      </div>
    </section>
  );
}
