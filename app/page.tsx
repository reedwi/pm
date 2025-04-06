import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to PM Tool</h1>
        <p className="text-lg text-muted-foreground">
          A simple project management tool to help you stay organized
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href={ROUTES.LOGIN}>Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.SIGNUP}>Sign Up</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
