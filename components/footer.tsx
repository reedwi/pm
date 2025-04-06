export function Footer() {
  return (
    <footer className="border-t py-4 bg-background">
      <div className="container flex items-center justify-center">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PM Tool. All rights reserved.</p>
      </div>
    </footer>
  )
}

