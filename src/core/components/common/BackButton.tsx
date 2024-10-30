// Icons: https://lucide.dev/icons/
import { ArrowLeft } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
// External imports
import { spring } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
import { useNavigate } from 'react-router-dom';
// React component
export function BackButton({ label }: { label: string }) {
  const [backScope, backAnimation] = useAnimate();
  const navigate = useNavigate();

  function handleMouseOver(): void {
    backAnimation(backScope.current, { translate: '-3px' }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
  }

  function handleMouseOut(): void {
    backAnimation(backScope.current, { translate: '0px' }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
  }

  return (
    <Button
      className='flex flex-row items-center space-x-2 text-xs font-medium uppercase'
      size='sm'
      variant='outline'
      onClick={() => navigate(-1)}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <ArrowLeft ref={backScope} size={16} strokeWidth={2} />
      <span>{label}</span>
    </Button>
  );
}
