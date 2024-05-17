import React from 'react'
import { FeaturedIcon } from '../FeaturedIcon'

interface MarketCardProps {
  icon: JSX.Element
  title: string
  description: string
}

export const MarketCard = ({ icon, title, description }: MarketCardProps) => {
  return (
    <div className='lg:max-w-[520px]'>
      <FeaturedIcon className='!w-11 !h-11 p-2'>
        {icon}
      </FeaturedIcon>

      <strong
        className="
          block lg:text-body-extra-large text-body-large font-semibold
          text-gray-light-950 dark:text-gray-dark-50 my-3
        "
      >
        {title}
      </strong>
      <p className="text-body-large font-regular text-gray-light-600 dark:text-gray-dark-400">
        {description}
      </p>
    </div>
  )
}
