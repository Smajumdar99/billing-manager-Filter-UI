import { FC, useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Input } from "@/components/atoms/Input"
import { Checkbox } from "@/components/atoms/Checkbox"
import { MedicalBackground } from "@/components/atoms/MedicalBackground"
import { ChevronDownIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/Form"
import { cn } from "@/lib/utils"
import { signIn } from '@/services/auth'
import { useAuth } from '@/context/AuthContext'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { TransitionLoader } from '@/components/atoms/TransitionLoader'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ThemeToggle } from '@/components/atoms/ThemeToggle'
import { ShimmerButton } from '@/components/atoms/ShimmerButton'

interface FeatureCardProps {
  title: string
  icon: JSX.Element
  features: string[]
}

const FeatureCard: FC<FeatureCardProps> = ({ title, icon, features }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white/5 backdrop-blur-lg dark:bg-white/5 rounded-lg border border-white/10 shadow-lg">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center p-3 text-left lg:cursor-default"
      >
        <div className="flex items-center gap-2 flex-1">
          <div className="p-1.5 rounded-md bg-blue-500/20 dark:bg-blue-500/20 shrink-0">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-white/90 dark:text-white/90">
            {title}
          </h3>
        </div>
        <ChevronDownIcon 
          className={cn(
            "w-4 h-4 text-white/60 dark:text-white/60 transition-transform lg:hidden",
            isExpanded && "rotate-180"
          )} 
        />
      </button>
      
      <div 
        className={cn(
          "grid transition-[grid-template-rows] duration-200 lg:!grid-rows-[1fr]",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-3 pt-1 space-y-1">
            {features.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-400/60 dark:bg-blue-400/60" />
                <span className="text-xs text-white/70 dark:text-white/70">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const HomePage: FC = () => {
  useDocumentTitle('Login')
  const navigate = useNavigate()
  const { user } = useAuth()
  const [error, setError] = useState<string>('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    setIsAuthenticating(true)

    try {
      await signIn(data.email, data.password)
      setIsTransitioning(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.message)
      setIsAuthenticating(false)
      setIsTransitioning(false)
    }
  }

  const featureCards = [
    {
      title: "Meaningful Use Stage 3",
      icon: (
        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: [
        'Electronic Prescribing',
        'Health Information Exchange',
        'Patient Portal Access'
      ]
    },
    {
      title: "Value-Based Care",
      icon: (
        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      features: [
        'Quality Metrics Tracking',
        'Population Health',
        'Cost Optimization'
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <>
      {isTransitioning ? (
        <TransitionLoader />
      ) : (
        <div className="min-h-screen bg-background">
          <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Section - Hero */}
            <div className="w-full lg:w-[55%] relative min-h-[50vh] lg:min-h-screen">
              {/* Mobile Background */}
              <div className="absolute inset-0 lg:hidden">
                <MedicalBackground />
              </div>
              
              {/* Desktop Background */}
              <div className="hidden lg:block absolute inset-0">
                <MedicalBackground />
              </div>

              {/* Content Container with Padding */}
              <div className="relative z-10 flex items-center min-h-[50vh] lg:min-h-screen">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full max-w-2xl mx-auto lg:mx-auto px-4 lg:px-16 xl:px-24"
                >
                  {/* Logo */}
                  <motion.div 
                    variants={itemVariants}
                    className="flex justify-center lg:justify-start mb-12"
                  >
                    <img 
                      src="/logo.svg"
                      alt="DrCloud EHR" 
                      className="w-20 sm:w-24 lg:w-32 h-auto"
                    />
                  </motion.div>
                  
                  {/* Hero Content */}
                  <div className="space-y-8">
                    <motion.div variants={itemVariants} className="space-y-4">
                      <h1 className="text-2xl sm:text-3xl lg:text-5xl font-manrope font-bold tracking-tight text-white dark:text-white text-center lg:text-left">
                        <span className="lg:hidden">
                          Empowering Healthcare Through Digital Excellence
                        </span>
                        <span className="hidden lg:block">
                          Empowering <br />
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Healthcare</span> Through <br />
                          Digital Excellence
                        </span>
                      </h1>
                      <p className="text-sm sm:text-base lg:text-lg text-white/70 dark:text-white/70 text-center lg:text-left">
                        Experience the future of healthcare management with our comprehensive EHR solution
                      </p>
                    </motion.div>

                    {/* Feature Cards */}
                    <motion.div 
                      variants={itemVariants}
                      className="grid grid-cols-1 gap-4 relative"
                    >
                      {featureCards.map((card) => (
                        <FeatureCard
                          key={card.title}
                          title={card.title}
                          icon={card.icon}
                          features={card.features}
                        />
                      ))}
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div 
                      variants={itemVariants}
                      className="pt-6 flex flex-col items-center lg:items-start space-y-3"
                    >
                      <p className="text-sm font-medium text-white/70 dark:text-white/70">Trusted by Healthcare Providers</p>
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 dark:bg-blue-500/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 dark:bg-blue-500/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 dark:bg-blue-500/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center bg-card">
              <div className="w-full max-w-md mx-auto px-4 py-8 lg:py-0 lg:px-12 xl:px-16">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-2xl font-manrope font-semibold tracking-tight">
                      Login to your account
                    </h2>
                    <p className="text-xs sm:text-base text-muted-foreground">
                      Welcome back to DrCloud EHR.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>

                {/* Login Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email or Phone Number"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex items-center  space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="remember-me"
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-muted-foreground">
                              Remember me
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <Link 
                        to="/reset-password"
                        className="text-sm text-primary hover:text-primary/90 hover:underline transition-colors"
                      >
                        Reset Password?
                      </Link>
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600 text-center">
                          {error}
                        </p>
                      </div>
                    )}

                    <ShimmerButton
                      type="submit"
                      disabled={isAuthenticating}
                      size="md"
                      className="w-full font-semibold"
                      background="hsl(var(--primary))"
                      shimmerDuration="2s"
                    >
                      {isAuthenticating ? (
                        <span className="flex items-center gap-2">
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          SIGNING IN...
                        </span>
                      ) : (
                        'SIGN IN'
                      )}
                    </ShimmerButton>

                    <p className="text-center text-sm text-muted-foreground">
                      Don't have an account yet?{' '}
                      <Link 
                        to="/signup"
                        className="text-primary hover:text-primary/90 hover:underline transition-colors"
                      >
                        Join DrCloudEHR Now!
                      </Link>
                    </p>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HomePage 