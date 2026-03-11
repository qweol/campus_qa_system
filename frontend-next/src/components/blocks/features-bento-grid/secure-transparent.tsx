import LetterGlitch from '@/components/blocks/features-bento-grid/letter-glitch'

import Shield from '@/assets/svg/shield'

const SecureAccess = () => {
  return (
    <div className='relative h-57'>
      <LetterGlitch glitchSpeed={150} glitchColors={['#73737399']} outerVignette={false} smooth />
      <div className='absolute top-1/2 left-1/2 grid size-42 -translate-x-1/2 -translate-y-1/2 place-content-center bg-[radial-gradient(var(--card)_40%,transparent_90%)]'>
        <Shield />
      </div>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(transparent_20%,var(--background)_70%)]' />
    </div>
  )
}

export default SecureAccess
