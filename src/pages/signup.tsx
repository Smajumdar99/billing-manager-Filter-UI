import { FC, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/atoms/Input"
import { WarpBackground } from "@/components/atoms/WarpBackground"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/Form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select"
import { signUp } from '@/services/auth'
import { useAuth } from '@/context/AuthContext'
import { signupSchema, type SignupFormData } from '@/lib/validations/auth'
import { TransitionLoader } from '@/components/atoms/TransitionLoader'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ThemeToggle } from '@/components/atoms/ThemeToggle'
import { ShimmerButton } from '@/components/atoms/ShimmerButton'

const roleLabels: Record<string, string> = {
  billing_specialist: 'Billing Specialist',
  billing_manager: 'Billing Manager',
  clinician: 'Clinician',
  front_desk: 'Front Desk',
  clinic_admin: 'Clinic Admin/Supervisor',
  cfo: 'CFO',
  practice_manager: 'Practice Manager',
  ccbhc: 'CCBHC',
  clinical_admin: 'Clinical Admin',
  supervisor: 'Supervisor'
}

export const SignupPage: FC = () => {
  useDocumentTitle('Sign Up')
  const navigate = useNavigate()
  const { user } = useAuth()
  const [error, setError] = useState<string>('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      role: "front_desk",
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    setError('')
    setIsRegistering(true)

    try {
      await signUp(data.email, data.password, data.displayName, data.role)
      setIsTransitioning(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.message)
      setIsRegistering(false)
      setIsTransitioning(false)
    }
  }

  if (user) {
    navigate('/dashboard')
    return null
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
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-background lg:hidden dark:from-blue-950/20 dark:to-background" />
              <div className="hidden lg:block absolute inset-0">
                <WarpBackground
                  className="absolute inset-0 !p-0 !border-0 !rounded-none bg-gradient-to-br from-blue-50/80 via-background/90 to-blue-50/80 dark:from-blue-950/20 dark:via-background/90 dark:to-blue-950/20"
                  containerClassName="!mask-image:none"
                  beamsPerSide={6}
                  beamSize={8}
                  beamDuration={3}
                  perspective={1200}
                  gridColor="rgba(var(--primary), 0.08)"
                />
              </div>

              <div className="relative z-10 flex items-center min-h-[50vh] lg:min-h-screen">
                <div className="w-full max-w-2xl mx-auto lg:mx-auto px-4 lg:px-16 xl:px-24">
                  <div className="flex justify-center lg:justify-start">
                    <img 
                      src="/logo.svg"
                      alt="DrCloud EHR" 
                      className="w-20 sm:w-24 lg:w-32 h-auto"
                    />
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-manrope font-bold tracking-tight text-foreground text-center lg:text-left">
                      <span className="lg:hidden">
                        Join DrCloud EHR Today
                      </span>
                      <span className="hidden lg:block">
                        Join <br />
                        <span className="text-primary">DrCloud EHR</span> <br />
                        Today
                      </span>
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground text-center lg:text-left">
                      Create your account and start your journey with us
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Signup Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center bg-card">
              <div className="w-full max-w-md mx-auto px-4 py-8 lg:py-0 lg:px-12 xl:px-16">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-manrope font-semibold tracking-tight">
                      Create Account
                    </h2>
                    <p className="text-xs sm:text-base text-muted-foreground">
                      Fill in your details to get started.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
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
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your display name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(roleLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                              placeholder="Create a password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Confirm your password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600 text-center">
                          {error}
                        </p>
                      </div>
                    )}

                    <ShimmerButton
                      type="submit"
                      disabled={isRegistering}
                      size="md"
                      className="w-full font-semibold"
                      background="hsl(var(--primary))"
                      shimmerDuration="2s"
                    >
                      {isRegistering ? (
                        <span className="flex items-center gap-2">
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          CREATING ACCOUNT...
                        </span>
                      ) : (
                        'CREATE ACCOUNT'
                      )}
                    </ShimmerButton>

                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Link 
                        to="/"
                        className="text-primary hover:text-primary/90 hover:underline transition-colors"
                      >
                        Sign in here
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

export default SignupPage 