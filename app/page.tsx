import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Wallet, ArrowRight, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-white">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="relative w-40 h-40">
            <Image src="/images/multiris-logo.png" alt="Multiris Logo" fill className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">Multiris</h1>
          <p className="text-muted-foreground">Secure multisig wallet with World authentication</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Multiris</CardTitle>
            <CardDescription>The next generation of secure wallet management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">Enhanced Security</h3>
                <p className="text-sm text-muted-foreground">Multiple signatures required for transactions</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">Customizable Governance</h3>
                <p className="text-sm text-muted-foreground">Define your own threshold for transaction approvals</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">World ID Authentication</h3>
                <p className="text-sm text-muted-foreground">Verify your identity with World ID</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/auth">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          </TabsList>
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">• Multisignature wallet security</p>
                <p className="text-sm">• Customizable signature thresholds</p>
                <p className="text-sm">• World biometric authentication</p>
                <p className="text-sm">• Mobile-optimized experience</p>
                <p className="text-sm">• Real-time transaction monitoring</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="how-it-works" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How Multiris Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">1. Authenticate with World</p>
                <p className="text-sm">2. Create a multisig wallet and add signers</p>
                <p className="text-sm">3. Set your signature threshold</p>
                <p className="text-sm">4. Initiate and approve transactions securely</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

