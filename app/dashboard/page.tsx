"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle2, Plus } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import TransactionCard from "@/components/transaction-card"
import WalletCard from "@/components/wallet-card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Default transactions
const defaultTransactions = {
  pending: [
    {
      id: "tx1",
      title: "Send 0.5 WLD",
      recipient: "0x1a2...3b4c",
      amount: "0.5 WLD",
      signers: 2,
      signed: 1,
      date: "2 hours ago",
      status: "pending",
    },
    {
      id: "tx2",
      title: "Contract Interaction",
      recipient: "0x5d6...7e8f",
      amount: "0.05 WLD",
      signers: 3,
      signed: 2,
      date: "5 hours ago",
      status: "pending",
    },
  ],
  completed: [
    {
      id: "tx3",
      title: "Send 1.2 WLD",
      recipient: "0x9g0...1h2i",
      amount: "1.2 WLD",
      signers: 2,
      signed: 2,
      date: "Yesterday",
      status: "completed",
    },
  ],
}

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("wallets")
  const [wallets, setWallets] = useState<any[]>([])
  const [selectedWallet, setSelectedWallet] = useState("")
  const [pendingTransactions, setPendingTransactions] = useState(defaultTransactions.pending)
  const [completedTransactions, setCompletedTransactions] = useState(defaultTransactions.completed)
  const [currentWallet, setCurrentWallet] = useState<any>(null)
  const [userAddress, setUserAddress] = useState("")

  // Load data from localStorage
  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserAddress(user.address)
    }

    // Load wallets
    const storedWallets = localStorage.getItem("wallets")
    if (storedWallets) {
      const parsedWallets = JSON.parse(storedWallets)
      setWallets(parsedWallets)

      if (parsedWallets.length > 0) {
        setSelectedWallet(parsedWallets[0].id)
        setCurrentWallet(parsedWallets[0])
      } else {
        // Redirect to create wallet if no wallets exist
        router.push("/create-wallet")
        toast({
          title: "No wallets found",
          description: "Please create a wallet to continue",
        })
      }
    } else {
      // Redirect to create wallet if no wallets exist
      router.push("/create-wallet")
    }

    // Load transactions
    const storedTransactions = localStorage.getItem("transactions")
    if (storedTransactions) {
      const { pending, completed } = JSON.parse(storedTransactions)
      if (pending) setPendingTransactions(pending)
      if (completed) setCompletedTransactions(completed)
    }
  }, [router, toast])

  // Update current wallet when selected wallet changes
  useEffect(() => {
    const wallet = wallets.find((w) => w.id === selectedWallet)
    if (wallet) {
      setCurrentWallet(wallet)
    }
  }, [selectedWallet, wallets])

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <DashboardHeader userAddress={userAddress} />

      <div className="flex-1 p-4 pb-20">
        <div className="w-full max-w-md mx-auto space-y-4">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wallets">Wallets</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="wallets" className="space-y-4 mt-4">
              {wallets.length > 0 ? (
                wallets.map((wallet) => (
                  <WalletCard
                    key={wallet.id}
                    wallet={wallet}
                    isSelected={wallet.id === selectedWallet}
                    onClick={() => setSelectedWallet(wallet.id)}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="text-center text-muted-foreground mb-4">No wallets yet</p>
                    <Button asChild variant="outline">
                      <Link href="/create-wallet">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Wallet
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentWallet && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingTransactions.slice(0, 1).map((tx) => (
                      <TransactionCard key={tx.id} transaction={tx} />
                    ))}
                    {completedTransactions.slice(0, 1).map((tx) => (
                      <TransactionCard key={tx.id} transaction={tx} />
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setActiveTab("pending")}
                    >
                      View All Transactions
                      <Plus className="ml-2 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-4">
              {pendingTransactions.length > 0 ? (
                pendingTransactions.map((tx) => <TransactionCard key={tx.id} transaction={tx} />)
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">No pending transactions</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-4">
              {completedTransactions.length > 0 ? (
                completedTransactions.map((tx) => <TransactionCard key={tx.id} transaction={tx} />)
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">No completed transactions</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-2">
        <div className="w-full max-w-md mx-auto">
          <Button asChild className="w-full" disabled={wallets.length === 0}>
            <Link href={wallets.length > 0 ? "/transaction/new" : "#"}>
              <Plus className="mr-2 h-4 w-4" />
              New Transaction
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

