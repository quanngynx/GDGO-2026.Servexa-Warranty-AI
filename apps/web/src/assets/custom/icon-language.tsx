import type { SVGProps } from 'react'

export const IconLanguage = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        {...props}
        className={`lucide lucide-languages size-4 ${props.className || ''}`}
    >
        <path d='m5 8 6 6'></path>
        <path d='m4 14 6-6 2-3'></path>
        <path d='M2 5h12'></path>
        <path d='M7 2h1'></path>
        <path d='m22 22-5-10-5 10'></path>
        <path d='M14 18h6'></path>
    </svg>
)
