import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

interface TransactionProps {
  transaction: {
    id: string
    title: string
    recipient: string
    amount: string
    signers: number
    signed: number
    date: string
    status: string
  }
}

export default function TransactionCard({ transaction }: TransactionProps) {
  return (
    <Link href={`/transaction/details/${transaction.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{transaction.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">{transaction.recipient}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium">{transaction.amount}</span>
              <span className="text-xs text-muted-foreground">WorldCoin</span>
              <span className="text-xs text-muted-foreground">{transaction.date}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              {transaction.status === "pending" ? (
                <Clock className="h-3 w-3 text-muted-foreground mr-1" />
              ) : (
                <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
              )}
              <span className="text-xs">
                {transaction.signed} of {transaction.signers} signatures
              </span>
            </div>
            <Badge variant={transaction.status === "pending" ? "outline" : "secondary"} className="text-xs">
              {transaction.status === "pending" ? "Pending" : "Completed"}
            </Badge>
          </div>

          <Progress value={(transaction.signed / transaction.signers) * 100} className="h-1.5" />
        </CardContent>
      </Card>
    </Link>
  )
}

