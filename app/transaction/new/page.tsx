"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewTransaction() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [wallets, setWallets] = useState<any[]>([])
  const [selectedWallet, setSelectedWallet] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Load wallets from localStorage
    const storedWallets = localStorage.getItem("wallets")
    if (storedWallets) {
      const parsedWallets = JSON.parse(storedWallets)
      setWallets(parsedWallets)
      if (parsedWallets.length > 0) {
        setSelectedWallet(parsedWallets[0].id)
      }
    } else {
      // Redirect if no wallets
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Get form data
    const form = e.target as HTMLFormElement
    const title = (form.elements.namedItem("title") as HTMLInputElement).value
    const recipient = (form.elements.namedItem("recipient") as HTMLInputElement).value
    const amount = (form.elements.namedItem("amount") as HTMLInputElement).value
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value

    // Create new transaction
    const newTransaction = {
      id: `tx-${Date.now()}`,
      title,
      recipient,
      amount: `${amount} WLD`,
      signers: wallets.find((w) => w.id === selectedWallet)?.signers || 2,
      signed: 1,
      date: "Just now",
      status: "pending",
      walletId: selectedWallet,
      description,
    }

    // Add to transactions in localStorage
    const storedTransactions = localStorage.getItem("transactions")
    const transactions = storedTransactions ? JSON.parse(storedTransactions) : { pending: [], completed: [] }
    transactions.pending = [newTransaction, ...transactions.pending]
    localStorage.setItem("transactions", JSON.stringify(transactions))

    // Simulate transaction creation
    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/transaction/details/${newTransaction.id}`)
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold ml-2">New Transaction</h1>
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create Transaction</CardTitle>
            <CardDescription>This transaction will require signatures from wallet members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallets.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="wallet">Select Wallet</Label>
                <select
                  id="wallet"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                >
                  {wallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Transaction Title</Label>
              <Input id="title" name="title" placeholder="e.g., Send WLD to Alice" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input id="recipient" name="recipient" placeholder="0x..." required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (WLD)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.001"
                min="0"
                placeholder="0.00"
                pattern="[0-9]*[.]?[0-9]*"
                inputMode="decimal"
                title="Please enter a valid number"
                required
                onKeyPress={(e) => {
                  // Allow only numbers and decimal point
                  const charCode = e.which ? e.which : e.keyCode
                  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
                    e.preventDefault()
                  }
                  // Prevent multiple decimal points
                  if (charCode === 46 && e.currentTarget.value.includes(".")) {
                    e.preventDefault()
                  }
                }}
                onChange={(e) => {
                  // Remove any non-numeric characters except decimal point
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "")
                  // Ensure only one decimal point
                  const parts = e.currentTarget.value.split(".")
                  if (parts.length > 2) {
                    e.currentTarget.value = parts[0] + "." + parts.slice(1).join("")
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" name="description" placeholder="Add details about this transaction" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Transaction...
                </>
              ) : (
                "Create Transaction"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

