import { FC } from 'react'

export const NotFoundIllustration: FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      <div className="relative">
        <h1 className="text-[12rem] font-bold text-primary text-center leading-none select-none">
          404
        </h1>
      </div>
    </div>
  )
} 