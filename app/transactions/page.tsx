"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function TransactionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<any[]>([])
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("history")
  const [userAddress, setUserAddress] = useState("")

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserAddress(user.address)
    }

    // Load transactions
    const storedTransactions = localStorage.getItem("transactions")
    if (storedTransactions) {
      const { pending, completed } = JSON.parse(storedTransactions)

      // Combine and sort transactions by date (newest first)
      const allTransactions = [
        ...pending.map((tx: any) => ({ ...tx, status: "pending" })),
        ...completed.map((tx: any) => ({ ...tx, status: "completed" })),
      ]

      // Add some mock transaction hashes and execution times
      const enhancedTransactions = allTransactions.map((tx: any) => ({
        ...tx,
        hash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
        executedAt: new Date(Date.now() - Math.random() * 10000000).toISOString(),
        signers: tx.signers || 2,
        signed: tx.signed || 1,
        direction: Math.random() > 0.3 ? "sent" : "received",
      }))

      setTransactions(enhancedTransactions)
    }
  }, [])

  const toggleTransactionDetails = (txId: string) => {
    if (expandedTransaction === txId) {
      setExpandedTransaction(null)
    } else {
      setExpandedTransaction(txId)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    if (address.includes("...")) return address
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <Image src="/images/multiris-logo.png" alt="Multiris Logo" fill className="object-contain" />
              </div>
              <h1 className="font-semibold">Transactions</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 pb-20">
        <div className="w-full max-w-md mx-auto space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="queue">Queue</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="queue" className="space-y-4 mt-4">
              <div className="text-center text-muted-foreground py-8">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pending transactions in queue</p>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {/* Group transactions by date */}
                  {transactions.map((tx, index) => (
                    <div key={tx.id} className="space-y-2">
                      {index === 0 ||
                      new Date(tx.executedAt).toDateString() !==
                        new Date(transactions[index - 1].executedAt).toDateString() ? (
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider pt-2">
                          {new Date(tx.executedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      ) : null}

                      <Card
                        className="hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => toggleTransactionDetails(tx.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {tx.direction === "sent" ? (
                                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
                                  <ArrowUp className="h-4 w-4 text-red-500" />
                                </div>
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                                  <ArrowDown className="h-4 w-4 text-green-500" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">
                                  {tx.direction === "sent" ? "Sent" : "Received"} {tx.amount}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(tx.executedAt).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge variant={tx.status === "completed" ? "secondary" : "outline"} className="mr-2">
                                {tx.status === "completed" ? "Success" : "Pending"}
                              </Badge>
                              {expandedTransaction === tx.id ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>

                          {expandedTransaction === tx.id && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="space-y-4">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Sent to:</span>
                                  <div className="flex items-center">
                                    <span className="text-sm font-mono">{formatAddress(tx.recipient)}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 ml-1"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        copyToClipboard(tx.recipient)
                                      }}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Transaction hash:</span>
                                  <div className="flex items-center">
                                    <span className="text-sm font-mono">{formatAddress(tx.hash)}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 ml-1"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        copyToClipboard(tx.hash)
                                      }}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Executed:</span>
                                  <span className="text-sm">{formatDate(tx.executedAt)}</span>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Confirmations:</span>
                                    <span className="text-sm">
                                      {tx.signed} of {tx.signers}
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    {Array.from({ length: tx.signed }).map((_, i) => (
                                      <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <Avatar className="h-6 w-6 mr-2">
                                            <AvatarFallback>{i === 0 ? "Y" : i + 1}</AvatarFallback>
                                          </Avatar>
                                          <span className="text-xs font-mono">
                                            {i === 0
                                              ? formatAddress(userAddress)
                                              : `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`}
                                          </span>
                                        </div>
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      router.push(`/transaction/details/${tx.id}`)
                                    }}
                                  >
                                    View Full Details
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No transaction history</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="messages" className="space-y-4 mt-4">
              <div className="text-center text-muted-foreground py-8">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No messages</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-2">
        <div className="w-full max-w-md mx-auto">
          <Button asChild className="w-full">
            <Link href="/transaction/new">New Transaction</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

